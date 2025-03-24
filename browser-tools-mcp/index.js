const puppeteer = require('puppeteer');

let browser = null;

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new'
    });
  }
  return browser;
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

async function mcp_browser_screenshot({ url, output_path, full_page = false }) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: output_path,
      fullPage: full_page
    });
    return { success: true, path: output_path };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function mcp_browser_pdf({ url, output_path, format = 'A4' }) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: output_path,
      format: format
    });
    return { success: true, path: output_path };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function mcp_browser_extract_text({ url, selector }) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    let text;
    if (selector) {
      text = await page.$$eval(selector, elements => 
        elements.map(el => el.textContent.trim()).join('\n')
      );
    } else {
      text = await page.$eval('body', el => el.textContent.trim());
    }
    return { success: true, text };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function mcp_browser_evaluate({ url, script }) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const result = await page.evaluate(script);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function mcp_browser_get_metadata({ url }) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const metadata = await page.evaluate(() => {
      const getMetaContent = (name) => {
        const element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return element ? element.content : null;
      };
      
      const ogTags = {};
      document.querySelectorAll('meta[property^="og:"]').forEach(tag => {
        ogTags[tag.getAttribute('property')] = tag.content;
      });
      
      return {
        title: document.title,
        description: getMetaContent('description'),
        ogTags
      };
    });
    return { success: true, metadata };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await page.close();
  }
}

process.on('exit', closeBrowser);

module.exports = {
  mcp_browser_screenshot,
  mcp_browser_pdf,
  mcp_browser_extract_text,
  mcp_browser_evaluate,
  mcp_browser_get_metadata
};