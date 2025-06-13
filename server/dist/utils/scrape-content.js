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
exports.scrapeWebsiteContent = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrapeWebsiteContent = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    try {
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: 'domcontentloaded' });
        // ✅ Scroll outside of page.evaluate to avoid __awaiter error
        yield autoScroll(page);
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const title = yield page.title();
        const description = (yield page.$eval('meta[name="description"]', el => el.getAttribute('content'))) || '';
        const markdown = yield page.evaluate(() => {
            const tagMap = {
                H1: '# ',
                H2: '## ',
                H3: '### ',
                H4: '#### ',
                H5: '##### ',
                H6: '###### ',
                P: '',
                LI: '- ',
                SPAN: ''
            };
            const output = [];
            const elements = Array.from(document.body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a'));
            elements.forEach(el => {
                var _a;
                const tag = el.tagName;
                const text = (_a = el.innerText) === null || _a === void 0 ? void 0 : _a.trim();
                if (!text || text.length < 5)
                    return;
                if (tag === 'A') {
                    const href = el.href;
                    if (href && href.startsWith('http')) {
                        output.push(`[${text}](${href})`);
                    }
                    else {
                        output.push(text);
                    }
                }
                else {
                    const prefix = tagMap[tag] || '';
                    output.push(prefix + text);
                }
            });
            return output.join('\n\n');
        });
        return {
            title,
            description,
            markdown,
        };
    }
    catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
    finally {
        yield browser.close();
    }
});
exports.scrapeWebsiteContent = scrapeWebsiteContent;
// ✅ Add this helper
const autoScroll = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.evaluate(() => {
        return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
});
