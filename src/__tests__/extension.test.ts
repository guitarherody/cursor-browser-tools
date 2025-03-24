import { BrowserTools } from '../extension';

describe('BrowserTools', () => {
  let browserTools: BrowserTools;

  beforeEach(() => {
    browserTools = new BrowserTools({
      headless: true,
      defaultViewport: { width: 800, height: 600 }
    });
  });

  afterEach(async () => {
    await browserTools.close();
  });

  it('should initialize browser', async () => {
    await browserTools.initialize();
    const page = await browserTools.createPage();
    expect(page).toBeDefined();
    await page.close();
  });

  it('should take screenshot', async () => {
    const screenshot = await browserTools.screenshot('https://example.com');
    expect(screenshot).toBeInstanceOf(Buffer);
  });

  it('should generate PDF', async () => {
    const pdf = await browserTools.pdf('https://example.com');
    expect(pdf).toBeInstanceOf(Buffer);
  });

  it('should get metadata', async () => {
    const metadata = await browserTools.getMetadata('https://example.com');
    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
    expect(metadata).toHaveProperty('ogTags');
  });

  it('should extract links', async () => {
    const links = await browserTools.extractLinks('https://example.com');
    expect(Array.isArray(links)).toBe(true);
    if (links.length > 0) {
      expect(links[0]).toHaveProperty('text');
      expect(links[0]).toHaveProperty('href');
    }
  });

  it('should evaluate custom function', async () => {
    const result = await browserTools.evaluate('https://example.com', () => {
      return document.title;
    });
    expect(typeof result).toBe('string');
  });
});