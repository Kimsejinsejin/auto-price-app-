import cron from 'node-cron';
import { supabase } from './database';
import { NaverCatalogScraper } from './naverCatalogScraper';
import { PriceEngine } from './priceEngine';
import { MarketAPIConnector } from './marketAPI';

const engine = new PriceEngine();
const marketAPI = new MarketAPIConnector();

// 1. 매 분마다(또는 지정된 주기마다) 실행되는 워커 함수
async function runPricingAutomation() {
  console.log(`\n🕒 [Scheduler] 가격 추적 스케줄러 가동 (${new Date().toLocaleString()})`);

  try {
    // 2. 켜져 있는(is_active) 상품들 목록을 Supabase DB에서 가져오기
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error(`❌ DB 조회 에러: ${error.message}`);
      // DB가 아직 빈 상태거나 연결이 안되었을 때 테스트용 가상 상품으로 진행
      return await fallbackTestRun();
    }

    if (!products || products.length === 0) {
      console.log(`💤 [Scheduler] 현재 자동 추적이 활성화된 상품이 없습니다.`);
      // 테스트 시연용 가상 런
      if (process.env.NODE_ENV !== 'production') return await fallbackTestRun();
      return;
    }

    console.log(`📌 [Scheduler] ${products.length}개의 상품 추적 시작...`);

    // 퍼포먼스를 위해 브라우저 인스턴스를 하나 켜서 재사용
    const scraper = new NaverCatalogScraper();
    await scraper.init();

    // 3. 각 상품별로 스크래핑 및 가격 계산 진행
    for (const product of products) {
      console.log(`\n------------------------------------------------`);
      console.log(`▶ 상품: ${product.name} (SKU: ${product.sku}) - 타겟 URL 분석 중...`);
      
      const scrapedData = await scraper.scrapeCatalog(product.target_catalog_url || '');

      // 전략 파싱
      const strategySettings = {
        strategyType: (product.strategy_type as any) || 'TARGET_MINUS_N',
        adjustAmount: product.adjust_amount || 100,
        stepUnit: product.step_unit || 100,
        useMarginDefense: product.use_margin_defense || true,
        useCircuitBreaker: product.use_circuit_breaker || true,
        circuitBreakerLimitPercent: product.circuit_breaker_limit_pct || 10.0
      };

      const productSettings = {
        costPrice: product.cost_price,
        minMarginRate: product.min_margin_rate,
        myShippingFee: product.my_shipping_fee || 3000,
        currentPrice: product.current_market_price || product.standard_price,
        standardPrice: product.standard_price
      };

      // 4. 엔진을 돌려 새 가격 계산
      const result = engine.calculateNewPrice(scrapedData, productSettings, strategySettings);

      if (result.calculatedPrice !== product.current_market_price) {
        // 가격이 바뀌었으면 마켓으로 전송하고 DB에 기록
        console.log(`✅ ${product.name} 가격 변동 감지! (${product.current_market_price} -> ${result.calculatedPrice})`);
        
        const success = await marketAPI.updatePrice('coupang', product.sku || product.id, result.calculatedPrice);
        
        if (success) {
          // DB에 로그 저장
          await supabase.from('price_logs').insert([
            {
              product_id: product.id,
              competitor_lowest_price: scrapedData.minPriceTarget?.totalPrice || 0,
              old_price: product.current_market_price || product.standard_price,
              new_price: result.calculatedPrice,
              reason: result.reason
            }
          ]);
          
          // 현재 마켓가(Feedback) 업데이트
          await supabase.from('products')
            .update({ current_market_price: result.calculatedPrice })
            .eq('id', product.id);
        }
      } else {
         console.log(`ℹ️ 가격 변동 없음. 기존 유지.`);
      }
    }

    await scraper.close();
    console.log(`\n🏁 [Scheduler] 1회 순회(Cycle) 완료.`);
    
  } catch (error) {
    console.error(`❌ 워커 치명적 에러:`, error);
  }
}

// 개발 편의를 위한 폴백 테스트 모드
async function fallbackTestRun() {
  console.log(`\n[Fallback] DB가 아직 비어있거나 연결이 안되어 임시 테스트용 가상 상품으로 진행합니다 (1개)`);
  
  const scraper = new NaverCatalogScraper();
  await scraper.init();
  const scrapedData = await scraper.scrapeCatalog('https://search.shopping.naver.com/catalog/dummy');
  
  const mockProduct = {
    costPrice: 10000,
    minMarginRate: 0.1,
    myShippingFee: 3000,
    currentPrice: 15000,
    standardPrice: 15000
  };
  
  const strategySettings = {
    strategyType: 'TARGET_MINUS_N' as const,
    adjustAmount: 100,
    stepUnit: 100,
    useMarginDefense: true,
    useCircuitBreaker: true,
    circuitBreakerLimitPercent: 10.0
  };

  const result = engine.calculateNewPrice(scrapedData, mockProduct, strategySettings);
  console.log(`=> 엔진 산출 결과: ${result.calculatedPrice}원 (${result.reason})`);
  
  await marketAPI.updatePrice('coupang', 'DUMMY_SKU-001', result.calculatedPrice);
  await scraper.close();
}

/**
 * 스케줄러 등록
 * 기본 세팅: 매 10분마다 실행. 
 * 테스트하려면 0 * * * * * (매 분마다) 로 수정
 */
cron.schedule('*/10 * * * *', () => {
   runPricingAutomation();
});

console.log('💚 워커 데몬(Worker Daemon)이 성공적으로 초기화되었습니다. 스케줄을 기다립니다.');

// 프로그램 시작 직후 테스트용으로 1회 즉시 실행
runPricingAutomation();
