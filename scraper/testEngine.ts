import { PriceEngine, ProductSettings, StrategySettings } from './priceEngine';
import { ScraperResult } from './naverCatalogScraper';

console.log("==========================================");
console.log("💰 실시간 가격 결정 엔진 (Price Engine) 테스트");
console.log("==========================================\n");

const engine = new PriceEngine();

// --- 공통 상품 기초 설정 ---
// 원가 10,000원 상품, 마진율 10% 이상 보장 희망, 내 쇼핑몰은 배송비 3,000원 부과 (상품가 전략 계산 시 배송비 고려)
// 마진 하한선은 대략 10000 / 0.9 = 11,111원 정도.
const baseProduct: ProductSettings = {
  costPrice: 10000,
  minMarginRate: 10,
  standardPrice: 15000,
  currentPrice: 15000,
  myShippingFee: 3000
};

// --- 공통 전략 설정 ---
// 무조건 최저가보다 100원 싸게! 단위는 100원 단위로 자름. 마진 방어와 서킷브레이커 작동.
const baseStrategy: StrategySettings = {
  strategyType: 'TARGET_MINUS_N',
  adjustAmount: 100,
  stepUnit: 100,
  useMarginDefense: true,
  useCircuitBreaker: true,
  circuitBreakerLimitPercent: 10
};

// 유틸리티 함수
function runScenario(name: string, scrapeData: any, productOverride: Partial<ProductSettings> = {}) {
  console.log(`\n▶️ [시나리오] ${name}`);
  const productInfo = { ...baseProduct, ...productOverride };
  const mockScrapeResult: ScraperResult = {
    success: true,
    minPriceTarget: scrapeData,
    products: scrapeData ? [scrapeData] : []
  };

  const result = engine.calculateNewPrice(mockScrapeResult, productInfo, baseStrategy);

  console.log(`- 경쟁사 총액: ${scrapeData ? scrapeData.totalPrice + '원' : '없음 (Fail)'}`);
  console.log(`- 내 기존가격: ${productInfo.currentPrice}원`);
  console.log(`- ⚙️ 결과 가격: [ ${result.calculatedPrice}원 ] (내 배송비를 합친 고객 결제 총액: ${result.calculatedPrice + productInfo.myShippingFee}원)`);
  console.log(`- 📈 예상 마진: ${result.expectedMarginAmount}원 (${result.expectedMarginRate}%)`);
  console.log(`- 📝 결정 사유: ${result.reason}`);
}

// ----------------------------------------------------
// 시나리오 1: 정상적인 가격 인하 (-100원 적용)
// 경쟁사가 총액 15,000원에 팔고 있다. (판매가 12,000 + 배송비 3,000)
// 나는 배송비 3,000원이므로, 타겟 목표 달성을 위해 내 상품 판매가는 11,900원이 되어야 총액 14,900원으로 100원 쌈.
runScenario("정상 가격 압박 (최저가 갱신)", {
  sellerName: '쿠팡(로켓)',
  totalPrice: 15000
});

// ----------------------------------------------------
// 시나리오 2: 마진 방어선 발동
// 출혈 경쟁 시작! 경쟁사가 11,000원에 마진 없이 팔기 시작했다.
// 목표 총액은 10,900원. 내 배송비 3,000원을 빼면 판매가를 7,900원으로 내려야 하지만 원가가 10,000원이다!
// 마진 하한가 로직 때문에 방어선이 켜짐.
runScenario("출혈 경쟁 (마진 방어 쉴드 작동)", {
  sellerName: '최저가충',
  totalPrice: 11000
});

// ----------------------------------------------------
// 시나리오 3: 서킷 브레이커 (급락 방지) 발동
// 경쟁사가 13,000원으로 팔지만, 내 현재 가격이 갑자기 너무 높은 15,000원이라서 한 번에 11,900원으로 내리면 20% 폭락.
// 급격한 하락은 오류일 수 있으므로 10%까지만 (즉 13,500원) 내린다.
runScenario("경쟁사 폭락 (서킷 브레이커 10% 방어 작동)", {
  sellerName: '미친세일몰',
  totalPrice: 13000
});

// ----------------------------------------------------
// 시나리오 4: 스크래핑 실패 (단독 판매)
// 타겟 없음 -> 기준선 복귀
runScenario("단독 판매 또는 스크래핑 실패 (표준 가격 원복)", null);

console.log("\n==========================================");
