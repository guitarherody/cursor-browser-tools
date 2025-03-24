# Cursor Browser Tools

A browser automation extension for Cursor IDE that provides powerful web scraping and interaction capabilities using Puppeteer.

## Features

- Screenshot web pages
- Generate PDFs from web pages
- Extract metadata and Open Graph tags
- Scrape links and other content
- Execute custom JavaScript in web pages
- Headless or headed browser operation

## Installation

```bash
npm install cursor-browser-tools
```

## Usage

```typescript
import { BrowserTools } from 'cursor-browser-tools';

// Initialize browser tools
const browserTools = new BrowserTools({
  headless: true,
  defaultViewport: { width: 1280, height: 720 }
});

// Take a screenshot
const screenshot = await browserTools.screenshot('https://example.com', {
  path: 'screenshot.png'
});

// Generate a PDF
const pdf = await browserTools.pdf('https://example.com', {
  path: 'page.pdf'
});

// Get page metadata
const metadata = await browserTools.getMetadata('https://example.com');
console.log(metadata.title);
console.log(metadata.description);
console.log(metadata.ogTags);

// Extract all links from a page
const links = await browserTools.extractLinks('https://example.com');
console.log(links);

// Clean up
await browserTools.close();
```

## Configuration

The `BrowserTools` constructor accepts a configuration object with the following options:

```typescript
interface BrowserToolsConfig {
  headless?: boolean;        // Run browser in headless mode (default: true)
  defaultViewport?: {        // Default viewport size
    width: number;
    height: number;
  };
}
```

## API Reference

### `initialize()`
Initializes the browser instance if not already initialized.

### `close()`
Closes the browser instance and cleans up resources.

### `createPage()`
Creates a new page in the browser.

### `screenshot(url: string, options?: ScreenshotOptions)`
Takes a screenshot of the specified URL.

### `pdf(url: string, options?: PDFOptions)`
Generates a PDF of the specified URL.

### `evaluate<T>(url: string, fn: () => T)`
Executes a function in the context of the specified web page.

### `getMetadata(url: string)`
Extracts metadata including title, description, and Open Graph tags from the specified URL.

### `extractLinks(url: string)`
Extracts all links from the specified URL.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT