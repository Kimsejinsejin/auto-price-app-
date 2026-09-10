import { NaverCatalogScraper, ScraperResult } from './naverCatalogScraper';

const CATALOG_URL = 'https://search.shopping.naver.com/catalog/43831776618';

// Fallback Mock Data for Development
const generateMockData = (): ScraperResult => ({
  success: true,
  minPriceTarget: {
    sellerName: '쿠팡(로켓)',
    productName: '카탈로그 상품',
    price: 14800,
    shippingFee: 0,
    totalPrice: 14800,
    isNPay: false
  },
  products: [
    { sellerName: '쿠팡(로켓)', productName: '카탈로그 상품', price: 14800, shippingFee: 0, totalPrice: 14800, isNPay: false },
    { sellerName: '11번가 B몰', productName: '카탈로그 상품', price: 14750, shippingFee: 3000, totalPrice: 17750, isNPay: false },
    { sellerName: '스마트스토어 A샵', productName: '카탈로그 상품', price: 15100, shippingFee: 3000, totalPrice: 18100, isNPay: true },
    { sellerName: 'G마켓 스마일', productName: '카탈로그 상품', price: 15500, shippingFee: 0, totalPrice: 15500, isNPay: false },
  ],
  captchaDetected: false
});

async function runTest() {
  console.log('🚀 Starting Naver Catalog Scraper...');
  console.log(`📡 Target URL: ${CATALOG_URL}`);
  
  const scraper = new NaverCatalogScraper();
  
  try {
    let result = await scraper.scrapeCatalog(CATALOG_URL);
    
    // IF CAPTCHA BLOCKED US, USE MOCK DATA TO CONTINUE TESTING THE PRICE ENGINE
    if (result.captchaDetected) {
      console.log('\n⚠️ 봇 탐지(Captcha)가 발생하여 네이버에서 스크래핑이 차단되었습니다.');
      console.log('💡 로컬 개발 및 가격 조정 엔진 테스트를 위해 [Mock 데이터]를 활성화합니다...\n');
      result = generateMockData();
    }

    if (result.success) {
      console.log('✅ Scrape (or Mock) Successful!');
      console.log('\n🏆 Lowest Price Target found:');
      console.log('--------------------------------------------------');
      console.table(result.minPriceTarget);
      
      console.log('\n📊 Top Competitors:');
      console.log('--------------------------------------------------');
      console.table(result.products.slice(0, 5));
    } else {
      console.error('\n❌ Scrape Failed:', result.error);
    }
  } catch (error) {
    console.error('Test script crashed:', error);
  } finally {
    await scraper.close();
    console.log('\n🏁 Scraper process finished.');
  }
}

runTest();

