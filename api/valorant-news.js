const OFFICIAL_NEWS_URL = 'https://playvalorant.com/en-us/news/';
const OFFICIAL_HOST = 'playvalorant.com';
const NEWS_WINDOW_DAYS = 30;

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'VALORANT-Study/1.0 (+official article reading activity)' }
    });
  } finally {
    clearTimeout(timeout);
  }
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>').replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripMarkup(value = '') {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function readMeta(html, key) {
  const tag = html.match(/<meta\b[^>]*>/gi)?.find(item =>
    new RegExp(`(?:property|name)=["']${key}["']`, 'i').test(item)
  );
  return tag?.match(/content=["']([^"']*)["']/i)?.[1] || '';
}

function extractArticleText(html) {
  const articleMarkup = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0]
    || html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || html;
  const content = articleMarkup
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ').replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ');
  const blocks = [...content.matchAll(/<(h[1-4]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(match => stripMarkup(match[2])).filter(text => text.length >= 24);
  return ([...new Set(blocks)].join('\n') || stripMarkup(content)).slice(0, 16000);
}

function parseDateFromMarkup(markup) {
  const dateValue = markup.match(/<(?:time|[^>]+)\b[^>]*\bdatetime=["']([^"']+)["']/i)?.[1]
    || markup.match(/\b20\d{2}-\d{2}-\d{2}(?:T[\d:.+-]+Z?)?/i)?.[0];
  if (!dateValue) return null;
  const date = new Date(decodeHtml(dateValue));
  return Number.isNaN(date.getTime()) ? null : date;
}

function extractRecentNews(html) {
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']*\/en-us\/news\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const unique = new Map();
  for (const match of anchors) {
    let url;
    try { url = new URL(decodeHtml(match[1]), OFFICIAL_NEWS_URL); } catch { continue; }
    if (url.hostname !== OFFICIAL_HOST || !/^\/en-us\/news\/(?!tags\/)[^/]+\/[^/]+\/?$/i.test(url.pathname)) continue;
    const index = match.index || 0;
    const before = html.slice(Math.max(0, index - 2200), index);
    const after = html.slice(index, Math.min(html.length, index + match[0].length + 2200));
    const cardStart = Math.max(before.lastIndexOf('<article'), before.lastIndexOf('<li'), before.lastIndexOf('data-testid'));
    const context = cardStart >= 0 ? before.slice(cardStart) + after : before.slice(-900) + after.slice(0, 1500);
    const publishedAt = parseDateFromMarkup(context);
    if (!publishedAt) continue;
    const age = Date.now() - publishedAt.getTime();
    if (age < -86400000 || age > NEWS_WINDOW_DAYS * 86400000) continue;
    const title = stripMarkup(match[2]).replace(/\s+/g, ' ');
    if (!title || unique.has(url.href)) continue;
    const summary = stripMarkup(context.replace(match[0], ' ')).slice(0, 240);
    unique.set(url.href, { id: url.pathname, title, sourceUrl: url.href, publishedAt: publishedAt.toISOString(), summary });
  }
  return [...unique.values()].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 50);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const requestedUrl = req.query?.url;
    if (requestedUrl) {
      let articleUrl;
      try { articleUrl = new URL(requestedUrl); } catch { return res.status(400).json({ error: '올바르지 않은 뉴스 주소입니다.' }); }
      if (articleUrl.hostname !== OFFICIAL_HOST || articleUrl.protocol !== 'https:' || !/^\/en-us\/news\/(?!tags\/)[^/]+\/[^/]+\/?$/i.test(articleUrl.pathname)) {
        return res.status(400).json({ error: '공식 VALORANT 뉴스 주소만 사용할 수 있습니다.' });
      }
      const articleResponse = await fetchWithTimeout(articleUrl.href);
      if (!articleResponse.ok) throw new Error(`Riot article returned HTTP ${articleResponse.status}`);
      const articleHtml = await articleResponse.text();
      const title = stripMarkup(readMeta(articleHtml, 'og:title'))
        || stripMarkup(articleHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '') || 'VALORANT News';
      const publishedAt = readMeta(articleHtml, 'article:published_time');
      const sourceText = extractArticleText(articleHtml);
      if (sourceText.length < 120) throw new Error('Official news article text could not be extracted.');
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
      return res.status(200).json({ title, sourceUrl: articleUrl.href, publishedAt, sourceText });
    }

    const listResponse = await fetchWithTimeout(OFFICIAL_NEWS_URL);
    if (!listResponse.ok) throw new Error(`Riot news list returned HTTP ${listResponse.status}`);
    const news = extractRecentNews(await listResponse.text());
    if (!news.length) throw new Error('No VALORANT news from the last 30 days was found.');
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json({ news, windowDays: NEWS_WINDOW_DAYS });
  } catch (error) {
    console.error('[VALORANT NEWS] Unable to load official news:', error.message);
    return res.status(502).json({ error: '최근 공식 영문 뉴스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
