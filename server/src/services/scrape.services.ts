import { scrapeWebsite, ScrapeResult, formatMarkdownTree } from '../utils/scrape-links';
import { scrapeWebsiteContent  , ScrapeResultContent } from '../utils/scrape-content';
/**
 * Handle the full scraping process using Puppeteer.
 */
export const handleScraping = async (url: string): Promise<ScrapeResult> => {
  return await scrapeWebsite(url);
};

/**
 * Convert the markdown string to a human-readable format.
 */
export const handleFormattedTree = (markdown: string): string => {
  return formatMarkdownTree(markdown);
};

/**
 * Handle the full scraping process for website content using Puppeteer.
 */
export const handleScrapingContent = async (url: string): Promise<ScrapeResultContent> => {
    return await scrapeWebsiteContent(url);
};

