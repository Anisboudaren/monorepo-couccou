"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeContentController = exports.scrapeController = void 0;
const scrape_services_1 = require("../services/scrape.services");
const deepseek_services_1 = require("../services/deepseek.services");
const scrapeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL is required and must be a string.' });
    }
    else {
        try {
            // Step 1: Scrape base metadata and links (includes markdown)
            const rawScrape = yield (0, scrape_services_1.handleScraping)(url);
            // Step 2: Format links into a structured hierarchy (LLM or custom logic)
            const structured = yield (0, deepseek_services_1.formatScrapedLinks)(rawScrape.title, rawScrape.description, rawScrape.links);
            // Step 3: Generate tree-style readable format from markdown
            // Step 4: Return all formats
            res.status(200).json({
                raw: rawScrape,
                structured,
            });
        }
        catch (error) {
            console.error('Scrape & format failed:', error);
            res.status(500).json({
                error: 'Failed to scrape and format',
                details: error.message,
            });
        }
    }
});
exports.scrapeController = scrapeController;
const deepseek_services_2 = require("../services/deepseek.services");
const scrapeContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL is required and must be a string.' });
    }
    else {
        try {
            // Step 1: Scrape content from the website
            const contentScrape = yield (0, scrape_services_1.handleScrapingContent)(url);
            // Step 2: Summarize the scraped content
            const summary = yield (0, deepseek_services_2.summarizeWebsiteContent)(contentScrape.markdown);
            // Step 3: Return the raw content and the summary
            res.status(200).json({
                summary
            });
        }
        catch (error) {
            console.error('Content scrape failed:', error);
            res.status(500).json({
                error: 'Failed to scrape and summarize content',
                details: error.message,
            });
        }
    }
});
exports.scrapeContentController = scrapeContentController;
