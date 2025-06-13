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
exports.handleScrapingContent = exports.handleFormattedTree = exports.handleScraping = void 0;
const scrape_links_1 = require("../utils/scrape-links");
const scrape_content_1 = require("../utils/scrape-content");
/**
 * Handle the full scraping process using Puppeteer.
 */
const handleScraping = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, scrape_links_1.scrapeWebsite)(url);
});
exports.handleScraping = handleScraping;
/**
 * Convert the markdown string to a human-readable format.
 */
const handleFormattedTree = (markdown) => {
    return (0, scrape_links_1.formatMarkdownTree)(markdown);
};
exports.handleFormattedTree = handleFormattedTree;
/**
 * Handle the full scraping process for website content using Puppeteer.
 */
const handleScrapingContent = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, scrape_content_1.scrapeWebsiteContent)(url);
});
exports.handleScrapingContent = handleScrapingContent;
