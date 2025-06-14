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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMarkdownTree = exports.scrapeWebsite = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrapeWebsite = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: 'networkidle2' });
        const data = yield page.evaluate(() => {
            var _a;
            const title = document.title;
            const description = ((_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || '';
            const origin = location.origin;
            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.includes(origin));
            return {
                title,
                description,
                links: Array.from(new Set(links)),
            };
        });
        const markdown = generateSimpleMarkdown(data.links);
        return Object.assign(Object.assign({}, data), { markdown });
    }
    catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
    finally {
        yield browser.close();
    }
});
exports.scrapeWebsite = scrapeWebsite;
const generateSimpleMarkdown = (links) => {
    return links.map(link => `- ${link}`).join('\n');
};
const formatMarkdownTree = (markdownText = '') => {
    const lines = markdownText
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('```'));
    let result = '';
    let currentSection = '';
    lines.forEach(line => {
        const match = line.match(/^-+\s*(.*?)\s*:?(\s*https?:\/\/\S+)?/);
        if (!match)
            return;
        const [, titleRaw, urlRaw] = match;
        const title = titleRaw.trim();
        const url = urlRaw === null || urlRaw === void 0 ? void 0 : urlRaw.trim();
        if (!line.startsWith('  ')) {
            // It's a main section
            currentSection = title;
            result += `\n${currentSection}\n`;
        }
        else {
            // It's a sub-item
            result += url ? `• ${title} → ${url}\n` : `• ${title}\n`;
        }
    });
    return result.trim();
};
exports.formatMarkdownTree = formatMarkdownTree;
