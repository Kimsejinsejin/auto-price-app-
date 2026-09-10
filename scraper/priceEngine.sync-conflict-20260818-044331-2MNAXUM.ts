import { ScraperResult, ScrapedProduct } from './naverCatalogScraper';

export type StrategyType = 'TARGET_MINUS_N' | 'SAME_PRICE' | 'TARGET_PLUS_N';

export interface ProductSettings {
  costPrice: number;        // 매입 원가 (VAT 포함)
  minMarginRate: number;    // 최소 보장 마진율 (%, 예: 10)
  standardPrice: number;    // 표준 판매가 (기준 가격)
  currentPrice: number;     // 현재 마켓에 등록된 판매가
  myShippingFee: number;    // 내 쇼핑몰의 배송비
}

export interface StrategySettings {
  strategyType: StrategyType; // 대응 전략 (무조건 - N, 동일가, + N)
  adjustAmount: number;     // 차감/증가 금액 (예: 100원. SAME_PRICE일 때는 무시)
  stepUnit: number;         // 단위 절사 (예: 10원 단위 절사, 100원 단위 절사)
  useMarginDefense: boolean;  // 마진 방어 활성화
  useCircuitBreaker: boolean; // 서킷 브레이커(급락 방지) 활성화
  circuitBreakerLimitPercent: number; // 1회 최대 인하 허용 폭 (%, 예: 10)
}

export interface PriceEngineResult {
  calculatedPrice: number;    // 최종 전송할 타겟 가격
  expectedMarginAmount: number; // 예상 마진액
  expectedMarginRate: number; // 예상 마진율 (%)
  reason: string;             // 가격이 결정된 사유
}

export class PriceEngine {
  
  /**
   * 스크래핑된 결과와 사용자 설정을 바탕으로 최적의 가격을 산출합니다.
   */
  public calculateNewPrice(
    scrapeResult: ScraperResult,
    product: ProductSettings,
    strategy: StrategySettings
  ): PriceEngineResult {
    
    // 1. 방어 로직: 스크래핑 실패이거나 비교 대상이 없을 경우 표준 판매가로 원복 (또는 유지)
    if (!scrapeResult.success || !scrapeResult.minPriceTarget) {
      return this.buildResult(product.standardPrice, product, `스크래핑 실패/타겟 없음. 표준가 복귀. (사유: ${scrapeResult.error || '알 수 없음'})`);
    }

    const target = scrapeResult.minPriceTarget;

    // 2. 경쟁사 '총 가격' - 내 '배송비' = 내가 맞춰야 할 '원 가격' 
    // 예: 적군(14,000 + 3,000 = 17,000). 내 배송비가 0원이면 내 판매가는 17,000에 맞춰야 동률.
    const rawMatchPrice = target.totalPrice - product.myShippingFee;

    // 3. 전략 반영
    let rawCalculatedPrice = rawMatchPrice;
    
    switch (strategy.strategyType) {
      case 'TARGET_MINUS_N':
        rawCalculatedPrice = rawMatchPrice - strategy.adjustAmount;
        break;
      case 'TARGET_PLUS_N':
        rawCalculatedPrice = rawMatchPrice + strategy.adjustAmount;
        break;
      case 'SAME_PRICE':
      default:
        rawCalculatedPrice = rawMatchPrice;
        break;
    }

    // 4. 단위 절사 (내림) 
    // 예: 100원 단위 모드, 14,850원 -> 14,800원
    const step = strategy.stepUnit > 0 ? strategy.stepUnit : 1;
    let finalTargetPrice = Math.floor(rawCalculatedPrice / step) * step;

    let reasonLogs: string[] = [`경쟁사 최저가 반영 (${target.sellerName}: 총액 ${target.totalPrice}원)`];

    // 5. 마진 방어선 (Fail-Safe)
    if (strategy.useMarginDefense) {
      // 마진율 = (판매가 - 원가 - 배달비 등 생략(여기선 단순화)) / 판매가
      // 최소 보장 판매가 = 원가 / (1 - (마진율 / 100))
      const marginLimitPrice = Math.ceil(product.costPrice / (1 - (product.minMarginRate / 100)));
      
      // 단위 절사 한 번 더 적용 (마진 방어선은 올려쳐야 안전하니까 올림)
      const formattedMarginLimit = Math.ceil(marginLimitPrice / step) * step;

      if (finalTargetPrice < formattedMarginLimit) {
         finalTargetPrice = formattedMarginLimit;
         reasonLogs.push(`🛡️ 마진 방어선 발동 (하한가: ${formattedMarginLimit}원 제한)`);
      }
    }

    // 6. 가격 급락 서킷 브레이커 (Fail-Safe)
    if (strategy.useCircuitBreaker && product.currentPrice > 0) {
      const dropLimitPrice = product.currentPrice * (1 - (strategy.circuitBreakerLimitPercent / 100));
      // 만약 최종 가격이 현재 판매가 대비 10% 이상 폭락했다면, 하락폭을 10%에서 멈춤
      const formattedDropLimit = Math.floor(dropLimitPrice / step) * step;
      
      if (finalTargetPrice < formattedDropLimit) {
        finalTargetPrice = formattedDropLimit;
        reasonLogs.push(`🚨 서킷 브레이커 발동 (최대 ${strategy.circuitBreakerLimitPercent}% 인하 제한됨)`);
      }
    }

    // 상태 요약 생성
    let finalReason = reasonLogs.join(' | ');

    return this.buildResult(finalTargetPrice, product, finalReason);
  }

  private buildResult(price: number, product: ProductSettings, reason: string): PriceEngineResult {
    const marginAmount = price - product.costPrice;
    const marginRate = price > 0 ? (marginAmount / price) * 100 : 0;

    return {
      calculatedPrice: price,
      expectedMarginAmount: Math.floor(marginAmount),
      expectedMarginRate: parseFloat(marginRate.toFixed(2)),
      reason
    };
  }
}
