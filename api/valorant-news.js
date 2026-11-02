const OFFICIAL_PATCH_NOTES_URL = 'https://playvalorant.com/en-us/news/tags/patch-notes/';
const OFFICIAL_HOST = 'playvalorant.com';

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
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripMarkup(value = '') {
  return decodeHtml(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function readMeta(html, key) {
  const tag = html.match(/<meta\b[^>]*>/gi)?.find(item =>
    new RegExp(`(?:property|name)=["']${key}["']`, 'i').test(item)
  );
  return tag?.match(/content=["']([^"']*)["']/i)?.[1] || '';
}

function extractArticleText(html) {
  const articleMarkup = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0]
    || html.match(/<main\b[\s\S]*?<\/main>/i)?.[0]
    || html;
  const content = articleMarkup
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ');
  const blocks = [...content.matchAll(/<(h[1-4]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(match => stripMarkup(match[2]))
    .filter(text => text.length >= 24);
  const extracted = [...new Set(blocks)].join('\n').slice(0, 16000);
  return extracted || stripMarkup(content).slice(0, 16000);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const listResponse = await fetchWithTimeout(OFFICIAL_PATCH_NOTES_URL);
    if (!listResponse.ok) throw new Error(`Riot news list returned HTTP ${listResponse.status}`);
    const listingHtml = await listResponse.text();
    const hrefs = [...listingHtml.matchAll(/href=["']([^"']*\/news\/game-updates\/[^"']*patch-notes[^"']*)["']/gi)]
      .map(match => decodeHtml(match[1]));
    const articleUrl = hrefs
      .map(href => new URL(href, OFFICIAL_PATCH_NOTES_URL))
      .find(url => url.hostname === OFFICIAL_HOST && /patch-notes/i.test(url.pathname));

    if (!articleUrl) throw new Error('No official VALORANT patch notes article was found.');

    const articleResponse = await fetchWithTimeout(articleUrl.href);
    if (!articleResponse.ok) throw new Error(`Riot article returned HTTP ${articleResponse.status}`);
    const articleHtml = await articleResponse.text();
    const title = stripMarkup(readMeta(articleHtml, 'og:title'))
      || stripMarkup(articleHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      || 'VALORANT Patch Notes';
    const publishedAt = readMeta(articleHtml, 'article:published_time');
    const articleText = extractArticleText(articleHtml);
    if (articleText.length < 200) throw new Error('Official patch notes text could not be extracted.');

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      title,
      sourceUrl: articleUrl.href,
      publishedAt,
      sourceText: articleText
    });
  } catch (error) {
    console.error('[VALORANT NEWS] Unable to load official patch notes:', error.message);
    return res.status(502).json({ error: '공식 영문 패치노트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
