import { Request, Response } from 'express';
import { handleScraping , handleScrapingContent } from '../services/scrape.services';
import { formatScrapedLinks } from '../services/deepseek.services';
import { formatMarkdownTree } from '../utils/scrape-links'; 

export const scrapeController = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required and must be a string.' });
  } else {
    try {
      // Step 1: Scrape base metadata and links (includes markdown)
      const rawScrape = await handleScraping(url);

      // Step 2: Format links into a structured hierarchy (LLM or custom logic)
      const structured = await formatScrapedLinks(
        rawScrape.title,
        rawScrape.description,
        rawScrape.links
      );

      // Step 3: Generate tree-style readable format from markdown
      

      // Step 4: Return all formats
      res.status(200).json({
        raw: rawScrape,
        structured,
        
      });
    } catch (error) {
      console.error('Scrape & format failed:', error);
      res.status(500).json({
        error: 'Failed to scrape and format',
        details: (error as Error).message,
      });
    }
  }
};

import { summarizeWebsiteContent } from '../services/deepseek.services';

export const scrapeContentController = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required and must be a string.' });
  } else {
    try {
      // Step 1: Scrape content from the website
      const contentScrape = await handleScrapingContent(url);

      // Step 2: Summarize the scraped content
      const summary = await summarizeWebsiteContent(contentScrape.markdown);

      // Step 3: Return the raw content and the summary
      res.status(200).json({
        summary
      });
    } catch (error) {
      console.error('Content scrape failed:', error);
      res.status(500).json({
        error: 'Failed to scrape and summarize content',
        details: (error as Error).message,
      });
    }
  }
};
