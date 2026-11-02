const OFFICIAL_NEWS_URL = 'https://playvalorant.com/en-us/news/';
const OFFICIAL_NEWS_LIST_URLS = [
  OFFICIAL_NEWS_URL,
  'https://playvalorant.com/en-us/news/community/',
  'https://playvalorant.com/en-us/news/announcements/',
  'https://playvalorant.com/en-us/news/game-updates/',
  'https://playvalorant.com/en-us/news/esports/',
  'https://playvalorant.com/en-us/news/dev/',
  'https://playvalorant.com/en-us/news/merch/',
  'https://valorantesports.com/en-US/news'
];
const OFFICIAL_HOST = 'playvalorant.com';
const OFFICIAL_ESPORTS_HOST = 'valorantesports.com';

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

function extractJsonLdArticleBody(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const bodies = [];
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.articleBody === 'string') bodies.push(value.articleBody);
    if (Array.isArray(value)) value.forEach(visit);
    else Object.values(value).forEach(visit);
  };
  for (const script of scripts) {
    try { visit(JSON.parse(script[1])); } catch { /* Ignore unrelated or malformed JSON-LD blocks. */ }
  }
  return bodies.map(stripMarkup).filter(text => text.length >= 120).sort((a, b) => b.length - a.length)[0] || '';
}

function extractArticleText(html) {
  const candidates = [
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0],
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0],
    html
  ].filter(Boolean);
  const extracted = candidates.map(markup => {
    const content = markup
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ').replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ');
    const blocks = [...content.matchAll(/<(h[1-4]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map(match => stripMarkup(match[2])).filter(text => text.length >= 24);
    return [...new Set(blocks)].join('\n');
  }).sort((a, b) => b.length - a.length)[0] || '';
  if (extracted.length >= 120) return extracted.slice(0, 16000);
  const structuredBody = extractJsonLdArticleBody(html);
  if (structuredBody) return structuredBody.slice(0, 16000);
  const description = stripMarkup(readMeta(html, 'og:description') || readMeta(html, 'description'));
  return [extracted, description].filter(Boolean).join('\n').slice(0, 16000);
}

function parseDateFromMarkup(markup) {
  const dateValue = markup.match(/<(?:time|[^>]+)\b[^>]*\bdatetime=["']([^"']+)["']/i)?.[1]
    || markup.match(/\b20\d{2}-\d{2}-\d{2}(?:T[\d:.+-]+Z?)?/i)?.[0]
    || markup.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+20\d{2}\b/i)?.[0]
    || markup.match(/\b\d{1,2}\/\d{1,2}\/20\d{2}\b/)?.[0];
  if (!dateValue) return null;
  const numericDate = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(20\d{2})$/);
  const date = numericDate
    ? new Date(Date.UTC(Number(numericDate[3]), Number(numericDate[1]) - 1, Number(numericDate[2]), 12))
    : new Date(decodeHtml(dateValue));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSupportedArticle(url) {
  if (url.protocol !== 'https:') return false;
  if (url.hostname === OFFICIAL_HOST) {
    return /^\/en-us\/news\/(?!tags\/)[^/]+\/[^/]+\/?$/i.test(url.pathname);
  }
  if (url.hostname === OFFICIAL_ESPORTS_HOST) {
    return /^\/en-[a-z]{2}\/(?:valorantesports\/)?news\/[^/]+\/?$/i.test(url.pathname);
  }
  return false;
}

function canonicalizeArticleUrl(url) {
  const aliasMatch = url.hostname === OFFICIAL_ESPORTS_HOST
    ? url.pathname.match(/^\/(en-[a-z]{2})\/news\/([^/]+)\/?$/i)
    : null;
  if (aliasMatch) {
    const canonical = new URL(url.href);
    canonical.pathname = `/${aliasMatch[1]}/valorantesports/news/${aliasMatch[2]}`;
    canonical.search = '';
    canonical.hash = '';
    return canonical;
  }
  return url;
}
function extractRecentNews(html, baseUrl = OFFICIAL_NEWS_URL) {
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const unique = new Map();
  for (const match of anchors) {
    let url;
    try { url = new URL(decodeHtml(match[1]), baseUrl); } catch { continue; }
    if (!isSupportedArticle(url)) continue;

    // The Riot newsroom links to written VCT coverage on its official esports site.
    // Read each card's date first so adjacent cards do not lend each other a date.
    const anchorText = stripMarkup(match[2]);
    const index = match.index || 0;
    const before = html.slice(Math.max(0, index - 1200), index);
    const after = html.slice(index + match[0].length, Math.min(html.length, index + match[0].length + 1200));
    const context = before.slice(-600) + match[0] + after.slice(0, 800);
    const publishedAt = parseDateFromMarkup(match[2]) || parseDateFromMarkup(context);

    const heading = match[2].match(/<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/i)?.[1];
    const titleText = (heading ? stripMarkup(heading) : anchorText)
      .replace(/\b20\d{2}-\d{2}-\d{2}T[\d:.+-]+Z?\b/gi, ' ')
      .replace(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+20\d{2}\b/gi, ' ')
      .replace(/\b\d{1,2}\/\d{1,2}\/20\d{2}\b/g, ' ')
      .replace(/^\s*(?:community|announcements?|game updates|esports|merch|dev)\s+/i, '')
      .replace(/\s+/g, ' ').trim();
    const title = (heading ? titleText : titleText.split(/(?<=[.!?])\s+/)[0]).slice(0, 180);
    if (!title || unique.has(url.href)) continue;
    unique.set(url.href, {
      id: url.href,
      title,
      sourceUrl: url.href,
      publishedAt: publishedAt ? publishedAt.toISOString() : null,
      summary: stripMarkup(context.replace(match[0], ' ')).slice(0, 240)
    });
  }
  return [...unique.values()];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let isArticleRequest = false;
  try {
    const requestedUrl = req.query?.url;
    isArticleRequest = Boolean(requestedUrl);
    if (requestedUrl) {
      let requestedArticleUrl;
      try { requestedArticleUrl = new URL(requestedUrl); } catch { return res.status(400).json({ error: '올바르지 않은 뉴스 주소입니다.' }); }
      if (!isSupportedArticle(requestedArticleUrl)) {
        return res.status(400).json({ error: '공식 VALORANT 뉴스 주소만 사용할 수 있습니다.' });
      }
      const articleUrl = canonicalizeArticleUrl(requestedArticleUrl);
      const articleResponse = await fetchWithTimeout(articleUrl.href);
      if (!articleResponse.ok) {
        console.error('[VALORANT NEWS] Article fetch failed:', articleUrl.hostname, articleResponse.status);
        return res.status(502).json({
          error: articleResponse.status === 404
            ? '공식 원문 주소가 바뀌었거나 삭제되었습니다.'
            : '공식 뉴스 서버가 원문 요청을 거부했습니다.'
        });
      }
      const finalUrl = new URL(articleResponse.url);
      if (!isSupportedArticle(finalUrl)) {
        return res.status(502).json({ error: '공식 원문 주소로 안전하게 연결하지 못했습니다.' });
      }
      const articleHtml = await articleResponse.text();
      const title = stripMarkup(readMeta(articleHtml, 'og:title'))
        || stripMarkup(articleHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '') || 'VALORANT News';
      const publishedAt = readMeta(articleHtml, 'article:published_time') || parseDateFromMarkup(articleHtml)?.toISOString() || null;
      const sourceText = extractArticleText(articleHtml);
      if (sourceText.length < 120) {
        console.error('[VALORANT NEWS] Article body extraction too short:', finalUrl.hostname, sourceText.length);
        return res.status(502).json({ error: '원문 페이지는 열렸지만 학습에 사용할 본문을 읽지 못했습니다.' });
      }
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
      return res.status(200).json({ title, sourceUrl: finalUrl.href, publishedAt, sourceText });
    }

    // Merge the official newsroom archives with written VALORANT Esports coverage.
    const pageResults = await Promise.allSettled(OFFICIAL_NEWS_LIST_URLS.map(async url => {
      const response = await fetchWithTimeout(url, 7000);
      if (!response.ok) throw new Error(`Riot news list returned HTTP ${response.status}`);
      return { url, html: await response.text() };
    }));
    const mergedNews = new Map();
    for (const result of pageResults) {
      if (result.status !== 'fulfilled') continue;
      for (const item of extractRecentNews(result.value.html, result.value.url)) {
        const existing = mergedNews.get(item.sourceUrl);
        if (!existing || item.title.length > existing.title.length) mergedNews.set(item.sourceUrl, item);
      }
    }
    const news = [...mergedNews.values()]
      .sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0))
      .slice(0, 20);
    if (!news.length) throw new Error('No official VALORANT news articles were found.');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ news, count: news.length });
  } catch (error) {
    console.error('[VALORANT NEWS] Unable to load official news:', error.message);
    return res.status(502).json({ error: isArticleRequest ? '공식 기사 원문 서버에 연결하지 못했습니다.' : '최근 공식 영문 뉴스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
