#!/usr/bin/env node
/**
 * 全ページ一括SEO・UX修正スクリプト
 * - og:image を全ページに追加
 * - 8記事に og:title/description/type を追加
 * - contact/privacy に BreadcrumbList JSON-LD を追加
 * - contact/privacy に robots noindex を追加
 * - 記事ページにレスポンシブ @media クエリを追加
 * - apple-touch-icon を全ページに追加
 * - dateModified を更新
 * - 記事間の相互リンクを強化
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nursery.root-for.jp';
const OG_IMAGE_URL = `${BASE_URL}/images/og-default.png`;
const TODAY = '2026-03-15';

// ==============================
// 全ページ共通: og:image + apple-touch-icon
// ==============================
function addGlobalMeta(html, filePath) {
  const fileName = path.basename(filePath);

  // og:image を追加（まだなければ）
  if (!html.includes('og:image')) {
    // 記事ページ用の個別OG画像があればそれを使う
    const articleImages = {
      'article-100yen.html': `${BASE_URL}/images/goods.png`,
      'article-bicycle.html': `${BASE_URL}/images/bicycle.png`,
      'article-education-cost.html': `${BASE_URL}/images/education_cost.png`,
      'article-fp.html': `${BASE_URL}/images/money.png`,
      'article-helmet.html': `${BASE_URL}/images/helmet.png`,
      'article-muji.html': `${BASE_URL}/images/muji.png`,
      'article-nishimatsuya.html': `${BASE_URL}/images/nishimatsuya.png`,
      'article-stamp.html': `${BASE_URL}/images/stamp.png`,
      'article-uniqlo.html': `${BASE_URL}/images/uniqlo.png`,
      'article-kengaku.html': `${BASE_URL}/images/kengaku.png`,
      'article-narashi.html': `${BASE_URL}/images/narashi.png`,
      'article_52points.html': `${BASE_URL}/images/borderline_real.png`,
      'guide.html': `${BASE_URL}/images/guide.png`,
      'criteria.html': `${BASE_URL}/images/criteria.png`,
    };
    const ogImg = articleImages[fileName] || OG_IMAGE_URL;
    html = html.replace(
      /<link rel="canonical"/,
      `<meta property="og:image" content="${ogImg}">\n    <link rel="canonical"`
    );
  }

  // apple-touch-icon を追加（まだなければ）
  if (!html.includes('apple-touch-icon')) {
    html = html.replace(
      '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
      '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">'
    );
  }

  return html;
}

// ==============================
// 8記事: og:title/description/type を追加
// ==============================
const articleOgData = {
  'article-100yen.html': {
    title: '100均で揃う！保育園準備おすすめリスト | 世田谷保育ナビ',
    desc: 'ダイソー・セリアで揃う保育園準備グッズのおすすめリスト。賢く節約しながら入園準備を進めるコツを紹介。',
  },
  'article-bicycle.html': {
    title: '【子供2人乗せ】電動自転車の選び方とメーカー比較 | 世田谷保育ナビ',
    desc: '保育園送迎に欠かせない子供乗せ電動アシスト自転車の選び方を解説。3大メーカーを比較。',
  },
  'article-fp.html': {
    title: '時短勤務で給料減＆保育料で赤字？復職前に見直す家計のポイント | 世田谷保育ナビ',
    desc: '復職後の時短勤務による収入減と保育料の負担で家計が赤字にならないための対策を解説。',
  },
  'article-helmet.html': {
    title: '子供用ヘルメットの失敗しない選び方・イヤイヤ対策 | 世田谷保育ナビ',
    desc: '子供用ヘルメットの選び方と嫌がって被ってくれないときのイヤイヤ対策を解説。',
  },
  'article-muji.html': {
    title: '無印良品が子育て家庭の味方！食品＆衣類のおすすめ活用術 | 世田谷保育ナビ',
    desc: '無印良品の食品・衣類が子育て家庭に人気の理由を解説。忙しいパパママの毎日を助けるアイテムを紹介。',
  },
  'article-nishimatsuya.html': {
    title: '西松屋が最強！保育園準備で「まず行くべき」理由とおすすめ品 | 世田谷保育ナビ',
    desc: '保育園の入園準備は西松屋が最強コスパ。毎日の消耗品を安く揃えるコツとおすすめアイテムを紹介。',
  },
  'article-stamp.html': {
    title: '全ての持ち物に記名！？「お名前スタンプ」の魔法 | 世田谷保育ナビ',
    desc: '保育園のオムツや服への記名作業を劇的に楽にするお名前スタンプの選び方と活用術を紹介。',
  },
  'article-uniqlo.html': {
    title: 'ユニクロが保育園児の最強ウェア！レギンス・肌着・アウターの選び方 | 世田谷保育ナビ',
    desc: '保育園児にユニクロが選ばれる理由を徹底解説。丈夫で動きやすいアイテムの選び方とサイズ選びのコツ。',
  },
  'article-education-cost.html': {
    title: '共働き世帯の教育費のリアル｜0歳〜18歳で総額いくらかかる？ | 世田谷保育ナビ',
    desc: '共働き子育て世帯が知っておくべき教育費のリアル。年齢別にかかるお金を徹底解説。',
  },
};

function addArticleOgTags(html, fileName) {
  const data = articleOgData[fileName];
  if (!data) return html;

  // 既にog:titleがあればスキップ
  if (html.includes('og:title')) return html;

  const ogTags = `    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.desc}">
    <meta property="og:type" content="article">`;

  // og:site_name の後に挿入、なければ canonical の前に挿入
  if (html.includes('og:site_name')) {
    html = html.replace(
      /(<meta property="og:site_name"[^>]*>)/,
      `$1\n${ogTags}`
    );
  } else {
    html = html.replace(
      /<link rel="canonical"/,
      `${ogTags}\n    <meta property="og:site_name" content="世田谷保育ナビ">\n    <link rel="canonical"`
    );
  }

  return html;
}

// article-fp.html は og:site_name も欠けている
function addMissingSiteName(html, fileName) {
  if (fileName === 'article-fp.html' && !html.includes('og:site_name')) {
    html = html.replace(
      /<link rel="canonical"/,
      `<meta property="og:site_name" content="世田谷保育ナビ">\n    <link rel="canonical"`
    );
  }
  return html;
}

// ==============================
// contact/privacy: robots noindex + BreadcrumbList
// ==============================
function addRobotsNoindex(html) {
  if (!html.includes('robots')) {
    html = html.replace(
      '<meta name="description"',
      '<meta name="robots" content="noindex, follow">\n    <meta name="description"'
    );
  }
  return html;
}

function addBreadcrumbSchema(html, fileName) {
  // 既にBreadcrumbListがあればスキップ
  if (html.includes('BreadcrumbList')) return html;

  const breadcrumbs = {
    'contact.html': {
      name: 'お問い合わせ',
      url: `${BASE_URL}/contact.html`,
    },
    'privacy.html': {
      name: 'プライバシーポリシー',
      url: `${BASE_URL}/privacy.html`,
    },
  };

  const data = breadcrumbs[fileName];
  if (!data) return html;

  const schema = `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "トップ", "item": "${BASE_URL}/" },
            { "@type": "ListItem", "position": 2, "name": "${data.name}" }
        ]
    }
    </script>`;

  html = html.replace(
    '<link rel="preconnect"',
    `${schema}\n    <link rel="preconnect"`
  );

  return html;
}

// ==============================
// 記事ページ: レスポンシブ @media を追加
// ==============================
function addResponsiveStyles(html, fileName) {
  // 記事ページでなければスキップ
  if (!fileName.startsWith('article-') && fileName !== 'article_52points.html') return html;

  // 既に @media があればスキップ
  if (html.includes('@media')) return html;

  const responsiveCSS = `
        /* レスポンシブ対応 */
        @media (max-width: 600px) {
            .container {
                padding: 16px;
                border: none;
            }

            .article-title {
                font-size: 20px;
            }

            .app-header {
                flex-direction: column;
                gap: 8px;
                padding: 10px 12px;
            }

            h2 {
                font-size: 18px;
            }

            h3 {
                font-size: 16px;
            }
        }`;

  // </style> の直前に挿入
  html = html.replace('    </style>', `${responsiveCSS}\n    </style>`);

  return html;
}

// ==============================
// dateModified を今日の日付に更新
// ==============================
function updateDateModified(html) {
  return html.replace(
    /"dateModified":\s*"[^"]*"/g,
    `"dateModified": "${TODAY}"`
  );
}

// ==============================
// 記事間の相互リンクを強化
// ==============================
const relatedArticles = {
  'article-100yen.html': [
    { href: 'article-nishimatsuya.html', text: '西松屋が最強！保育園準備で「まず行くべき」理由' },
    { href: 'article-stamp.html', text: '全ての持ち物に記名！？「お名前スタンプ」の魔法' },
    { href: 'article-kengaku.html', text: '保育園見学チェックリスト38項目' },
  ],
  'article-bicycle.html': [
    { href: 'article-helmet.html', text: '子供用ヘルメットの失敗しない選び方・イヤイヤ対策' },
    { href: 'article-narashi.html', text: '慣らし保育のリアルと乗り越え方' },
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
  ],
  'article-fp.html': [
    { href: 'article-education-cost.html', text: '共働き世帯の教育費のリアル｜0歳〜18歳で総額いくら？' },
    { href: 'article-narashi.html', text: '慣らし保育のリアルと乗り越え方' },
    { href: 'article_52points.html', text: '「世帯合計52点」は安全圏？ボーダーライン解説' },
  ],
  'article-helmet.html': [
    { href: 'article-bicycle.html', text: '【子供2人乗せ】電動自転車の選び方とメーカー比較' },
    { href: 'article-narashi.html', text: '慣らし保育のリアルと乗り越え方' },
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
  ],
  'article-muji.html': [
    { href: 'article-nishimatsuya.html', text: '西松屋が最強！保育園準備で「まず行くべき」理由' },
    { href: 'article-uniqlo.html', text: 'ユニクロが保育園児の最強ウェア！' },
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
  ],
  'article-nishimatsuya.html': [
    { href: 'article-uniqlo.html', text: 'ユニクロが保育園児の最強ウェア！' },
    { href: 'article-muji.html', text: '無印良品が子育て家庭の味方！食品＆衣類のおすすめ活用術' },
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
  ],
  'article-stamp.html': [
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
    { href: 'article-nishimatsuya.html', text: '西松屋が最強！保育園準備で「まず行くべき」理由' },
    { href: 'article-kengaku.html', text: '保育園見学チェックリスト38項目' },
  ],
  'article-uniqlo.html': [
    { href: 'article-nishimatsuya.html', text: '西松屋が最強！保育園準備で「まず行くべき」理由' },
    { href: 'article-muji.html', text: '無印良品が子育て家庭の味方！食品＆衣類のおすすめ活用術' },
    { href: 'article-100yen.html', text: '100均で揃う！保育園準備おすすめリスト' },
  ],
  'article-education-cost.html': [
    { href: 'article-fp.html', text: '時短勤務で給料減＆保育料で赤字？復職前に見直す家計のポイント' },
    { href: 'article_52points.html', text: '「世帯合計52点」は安全圏？ボーダーライン解説' },
    { href: 'article-narashi.html', text: '慣らし保育のリアルと乗り越え方' },
  ],
};

function updateRelatedArticles(html, fileName) {
  const links = relatedArticles[fileName];
  if (!links) return html;

  // 既存の関連記事セクション（<h3>あわせて読みたい or 関連記事）の<ul>を見つけて置換
  const relatedUlRegex = /(<h3[^>]*>(?:あわせて読みたい|関連記事)[^<]*<\/h3>\s*<ul[^>]*>)([\s\S]*?)(<\/ul>)/;
  const match = html.match(relatedUlRegex);
  if (!match) return html;

  const newItems = links.map(l =>
    `                <li><a href="${l.href}" style="color:#2d7cbc;font-weight:bold;">${l.text}</a></li>`
  ).join('\n');

  html = html.replace(relatedUlRegex, `$1\n${newItems}\n            $3`);

  return html;
}

// ==============================
// index.html: BreadcrumbList を追加
// ==============================
function addIndexBreadcrumb(html, fileName) {
  if (fileName !== 'index.html') return html;
  if (html.includes('BreadcrumbList')) return html;

  // FAQPage JSON-LD の後に追加
  const breadcrumbSchema = `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "トップ", "item": "${BASE_URL}/" }
        ]
    }
    </script>`;

  // 最後の </script> の後（JSON-LDブロック）に挿入
  const lastJsonLdEnd = html.lastIndexOf('</script>\n    <link rel="preconnect"');
  if (lastJsonLdEnd > 0) {
    html = html.replace(
      '</script>\n    <link rel="preconnect"',
      `</script>${breadcrumbSchema}\n    <link rel="preconnect"`
    );
  }

  return html;
}

// ==============================
// メイン処理
// ==============================
const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f =>
  f.endsWith('.html') && f !== 'google75155eebf3af26f9.html'
);

let modifiedCount = 0;

htmlFiles.forEach(fileName => {
  const filePath = path.join(rootDir, fileName);
  let html = fs.readFileSync(filePath, 'utf-8');
  const original = html;

  // 1. 全ページ: og:image + apple-touch-icon
  html = addGlobalMeta(html, filePath);

  // 2. 8記事: OGタグ追加
  html = addMissingSiteName(html, fileName);
  html = addArticleOgTags(html, fileName);

  // 3. contact/privacy: robots noindex + BreadcrumbList
  if (fileName === 'contact.html' || fileName === 'privacy.html') {
    html = addRobotsNoindex(html);
    html = addBreadcrumbSchema(html, fileName);
  }

  // 4. index.html: BreadcrumbList
  html = addIndexBreadcrumb(html, fileName);

  // 5. 記事ページ: レスポンシブ対応
  html = addResponsiveStyles(html, fileName);

  // 6. dateModified 更新
  html = updateDateModified(html);

  // 7. 記事間の相互リンク強化
  html = updateRelatedArticles(html, fileName);

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ Modified: ${fileName}`);
    modifiedCount++;
  } else {
    console.log(`  Skipped (no changes): ${fileName}`);
  }
});

console.log(`\nDone! ${modifiedCount} files modified.`);
