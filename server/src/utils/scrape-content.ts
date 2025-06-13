import puppeteer, { Page } from 'puppeteer';

export interface ScrapeResultContent {
  title: string;
  description: string;
  markdown: string;
}

export const scrapeWebsiteContent = async (url: string): Promise<ScrapeResultContent> => {
  const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});


  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // ✅ Scroll outside of page.evaluate to avoid __awaiter error
    await autoScroll(page);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const title = await page.title();

    const description =
      (await page.$eval('meta[name="description"]', el => el.getAttribute('content'))) || '';

    const markdown = await page.evaluate(() => {
      const tagMap: Record<string, string> = {
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

      const output: string[] = [];
      const elements = Array.from(document.body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a'));

      elements.forEach(el => {
        const tag = el.tagName;
        const text = (el as HTMLElement).innerText?.trim();

        if (!text || text.length < 5) return;

        if (tag === 'A') {
          const href = (el as HTMLAnchorElement).href;
          if (href && href.startsWith('http')) {
            output.push(`[${text}](${href})`);
          } else {
            output.push(text);
          }
        } else {
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
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// ✅ Add this helper
const autoScroll = async (page: Page) => {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
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
};

