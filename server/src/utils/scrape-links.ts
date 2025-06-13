import puppeteer from 'puppeteer';

export interface ScrapeResult {
  title: string;
  description: string;
  links: string[];
  markdown: string;
}

export const scrapeWebsite = async (url: string): Promise<ScrapeResult> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
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

    return {
      ...data,
      markdown,
    };
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

const generateSimpleMarkdown = (links: string[]): string => {
  return links.map(link => `- ${link}`).join('\n');
};

export const formatMarkdownTree = (markdownText: string = ''): string => {
  const lines = markdownText
    .split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('```'));

  let result = '';
  let currentSection = '';

  lines.forEach(line => {
    const match = line.match(/^-+\s*(.*?)\s*:?(\s*https?:\/\/\S+)?/);

    if (!match) return;

    const [, titleRaw, urlRaw] = match;
    const title = titleRaw.trim();
    const url = urlRaw?.trim();

    if (!line.startsWith('  ')) {
      // It's a main section
      currentSection = title;
      result += `\n${currentSection}\n`;
    } else {
      // It's a sub-item
      result += url ? `• ${title} → ${url}\n` : `• ${title}\n`;
    }
  });

  return result.trim();
};
