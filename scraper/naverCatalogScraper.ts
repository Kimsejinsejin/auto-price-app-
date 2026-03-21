import { Browser, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

chromium.use(stealth());

export interface ScrapedProduct {
  sellerName: string;
  productName: string;
  price: number;
  shippingFee: number;
  totalPrice: number;
  isNPay: boolean;
}

export interface ScraperResult {
  success: boolean;
  minPriceTarget: ScrapedProduct | null;
  products: ScrapedProduct[];
  error?: string;
  captchaDetected?: boolean;
}

export class NaverCatalogScraper {
  private browser: Browser | null = null;

  async init() {
    // BrightData Proxy 설정 (환경변수에서 주입받아 사용)
    const proxyServer = process.env.BRIGHTDATA_PROXY_URL; // 예: 'http://brd.superproxy.io:22225'
    const proxyUsername = process.env.BRIGHTDATA_PROXY_USERNAME;
    const proxyPassword = process.env.BRIGHTDATA_PROXY_PASSWORD;

    const launchOptions: any = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    };

    if (proxyServer && proxyUsername && proxyPassword) {
      launchOptions.proxy = {
        server: proxyServer,
        username: proxyUsername,
        password: proxyPassword
      };
      console.log('🌎 [Scraper] BrightData Proxy 연동 됨');
    }

    this.browser = await chromium.launch(launchOptions);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeCatalog(catalogUrl: string): Promise<ScraperResult> {
    if (!this.browser) {
      await this.init();
    }

    const context = await this.browser!.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'ko-KR',
      timezoneId: 'Asia/Seoul'
    });
    
    // Naver sometimes blocks headless Chrome if webdriver is true. Stealth plugin handles most.
    const page = await context.newPage();

    try {
      await page.goto(catalogUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const html = await page.content();
      
      // Check for Bot Captcha
      if (html.includes('보안 확인을 완료해 주세요') || html.includes('captcha')) {
        return {
          success: false,
          minPriceTarget: null,
          products: [],
          error: 'Naver Anti-Bot Captcha detected. Headless Chrome was blocked.',
          captchaDetected: true
        };
      }

      // Try to find the __NEXT_DATA__ JSON script which Naver Shopping uses
      const $ = cheerio.load(html);
      const nextDataScript = $('#__NEXT_DATA__').html();
      
      const products: ScrapedProduct[] = [];

      if (nextDataScript) {
        try {
          const nextData = JSON.parse(nextDataScript);
          // The structure is heavily nested. We search for catalog product list recursively
          const jsonString = JSON.stringify(nextData);
          // Regex to find seller objects or price items inside the giant JSON
          // It's safer to extract from DOM if JSON structure is too volatile, but let's try DOM first
        } catch (e) {
          console.log('Failed to parse __NEXT_DATA__, falling back to DOM parsing');
        }
      }

      // DOM fallback extraction
      // Naver's product list items are usually li or div elements
      const listItems = $('[class*="productByMall_item_"], [class*="productList_item_"]');
      
      listItems.each((idx, el) => {
        let sellerName = $(el).find('[class*="mall_name"], [class*="mall_title"]').text().trim();
        if (!sellerName) {
          sellerName = $(el).find('[class*="mall_"] img').attr('alt') || 'Unknown Seller';
        }
        
        const priceText = $(el).find('[class*="price_num"], [class*="price_value"]').text().replace(/,/g, '').trim();
        const price = parseInt(priceText, 10) || 0;
        
        const deliveryText = $(el).find('[class*="delivery"]').text().replace(/,/g, '').trim();
        let shippingFee = 0;
        if (deliveryText.includes('무료')) {
          shippingFee = 0;
        } else {
          const match = deliveryText.match(/(\d+)/);
          if (match) {
            shippingFee = parseInt(match[0], 10);
          }
        }

        const isNPay = $(el).find('[class*="npay"]').length > 0;

        if (price > 0 && sellerName) {
          products.push({
            sellerName,
            productName: "카탈로그 상품",
            price,
            shippingFee,
            totalPrice: price + shippingFee,
            isNPay
          });
        }
      });

      const validProducts = products.filter(p => p.price > 0 && p.sellerName !== 'Unknown Seller');
      validProducts.sort((a, b) => a.totalPrice - b.totalPrice);

      const minPriceTarget = validProducts.length > 0 ? validProducts[0] : null;

      // If no valid products found but not blocked by captcha
      if (validProducts.length === 0) {
        return {
          success: false,
          minPriceTarget: null,
          products: [],
          error: 'No product prices found. CSS Selectors may have changed.'
        };
      }

      return {
        success: true,
        minPriceTarget,
        products: validProducts,
        captchaDetected: false
      };

    } catch (error: any) {
      return {
        success: false,
        minPriceTarget: null,
        products: [],
        error: error.message
      };
    } finally {
      await page.close();
    }
  }
}
