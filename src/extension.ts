import * as puppeteer from 'puppeteer';

export interface BrowserToolsConfig {
  headless?: boolean;
  defaultViewport?: {
    width: number;
    height: number;
  };
}

export class BrowserTools {
  private browser: puppeteer.Browser | null = null;
  private config: BrowserToolsConfig;

  constructor(config: BrowserToolsConfig = {}) {
    this.config = {
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: this.config.headless ? 'new' : false,
        defaultViewport: this.config.defaultViewport
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async createPage(): Promise<puppeteer.Page> {
    if (!this.browser) {
      await this.initialize();
    }
    return await this.browser!.newPage();
  }

  async screenshot(url: string, options?: puppeteer.ScreenshotOptions): Promise<Buffer> {
    const page = await this.createPage();
    await page.goto(url);
    const screenshot = await page.screenshot(options);
    await page.close();
    return screenshot as Buffer;
  }

  async pdf(url: string, options?: puppeteer.PDFOptions): Promise<Buffer> {
    const page = await this.createPage();
    await page.goto(url);
    const pdf = await page.pdf(options);
    await page.close();
    return pdf;
  }

  async evaluate<T>(url: string, fn: () => T): Promise<T> {
    const page = await this.createPage();
    await page.goto(url);
    const result = await page.evaluate(fn);
    await page.close();
    return result;
  }

  async getMetadata(url: string): Promise<{
    title: string;
    description: string;
    ogTags: Record<string, string>;
  }> {
    return this.evaluate(url, () => {
      const getMetaContent = (name: string): string => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta ? (meta as HTMLMetaElement).content : '';
      };

      const ogTags: Record<string, string> = {};
      document.querySelectorAll('meta[property^="og:"]').forEach((tag) => {
        const property = tag.getAttribute('property')!;
        ogTags[property] = (tag as HTMLMetaElement).content;
      });

      return {
        title: document.title,
        description: getMetaContent('description'),
        ogTags
      };
    });
  }

  async extractLinks(url: string): Promise<Array<{ text: string; href: string }>> {
    return this.evaluate(url, () => {
      const links: Array<{ text: string; href: string }> = [];
      document.querySelectorAll('a').forEach((a) => {
        links.push({
          text: a.textContent || '',
          href: a.href
        });
      });
      return links;
    });
  }
}