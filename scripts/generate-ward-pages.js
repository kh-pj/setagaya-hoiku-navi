#!/usr/bin/env node
// 区別ページ生成スクリプト
const fs = require('fs');
const path = require('path');

const wards = [
  { name: '西区',   slug: 'nishi',    desc: '西区（指扇・宝来など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '北区',   slug: 'kita',     desc: '北区（宮原・日進など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '大宮区', slug: 'omiya',    desc: '大宮区（大宮駅周辺・桜木町など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '見沼区', slug: 'minuma',   desc: '見沼区（東大宮・七里など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '中央区', slug: 'chuo',     desc: '中央区（与野・北与野など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '桜区',   slug: 'sakura',   desc: '桜区（中浦和・西浦和など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '浦和区', slug: 'urawa',    desc: '浦和区（浦和駅・北浦和など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '南区',   slug: 'minami',   desc: '南区（南浦和・武蔵浦和など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '緑区',   slug: 'midori',   desc: '緑区（東浦和・浦和美園など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
  { name: '岩槻区', slug: 'iwatsuki', desc: '岩槻区（岩槻駅・東岩槻など）の保育園空き状況を一覧で確認。年齢別・園名で検索可能。' },
];

const BASE_URL = 'https://nursery.root-for.jp';

function buildWardNav(currentSlug) {
  const links = wards.map(w => {
    const cls = w.slug === currentSlug ? 'ward-nav-link active' : 'ward-nav-link';
    return `            <a href="ward-${w.slug}.html" class="${cls}">${w.name}</a>`;
  }).join('\n');
  return `        <nav class="ward-nav" aria-label="区の切り替え">
            <a href="index.html" class="ward-nav-link ward-nav-all">全区</a>
${links}
        </nav>`;
}

function generatePage(ward) {
  const wardNav = buildWardNav(ward.slug);

  return `<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="世田谷区${ward.name}の保育園空き状況を一覧で確認。${ward.desc}認可・小規模・認定こども園対応。令和8年度最新データを毎月更新。">
    <meta name="keywords" content="世田谷区, ${ward.name}, 保育園, 空き状況, 空き, 保活, 待機児童, 東京, 最新, 令和8年度">
    <meta property="og:title" content="${ward.name} 保育園の空き状況一覧【令和8年度・毎月更新】｜世田谷保育ナビ">
    <meta property="og:description" content="世田谷区${ward.name}の保育園空き状況を一覧で確認。年齢別・園名検索で保活をサポート。">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="世田谷保育ナビ">
    <link rel="canonical" href="${BASE_URL}/ward-${ward.slug}.html">
    <title>世田谷区${ward.name} 保育園 空き状況【令和8年度・毎月更新】｜世田谷保育ナビ</title>
    <!-- 構造化データ -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "世田谷区${ward.name} 保育園 空き状況",
        "url": "${BASE_URL}/ward-${ward.slug}.html",
        "description": "世田谷区${ward.name}の保育園空き状況を一覧で確認できるページ",
        "isPartOf": {
            "@type": "WebSite",
            "name": "世田谷保育ナビ",
            "url": "${BASE_URL}/"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "トップ", "item": "${BASE_URL}/" },
                { "@type": "ListItem", "position": 2, "name": "${ward.name} 空き状況", "item": "${BASE_URL}/ward-${ward.slug}.html" }
            ]
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "世田谷区${ward.name}の保育園の空き状況はどこで確認できますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "世田谷保育ナビでは、世田谷区${ward.name}の認可保育所・小規模保育・認定こども園などの最新の空き状況を一覧で確認できます。年齢別・園名での検索も可能です。"
                }
            },
            {
                "@type": "Question",
                "name": "世田谷区${ward.name}で空きのある保育園は何園ありますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "空き状況は毎月変動します。このページでは${ward.name}の最新の空き状況を年齢別に一覧で確認できます。"
                }
            }
        ]
    }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
        rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans JP', "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif;
            letter-spacing: 0.03em;
            background: #f8f9fa;
            color: #444;
            margin: 0;
            padding: 0;
            padding-bottom: 70px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            padding: 24px;
            box-shadow: none;
            border-left: 1px solid #e2e7ea;
            border-right: 1px solid #e2e7ea;
            min-height: 100vh;
        }

        /* --- Global Header --- */
        .app-header {
            background: #ffffff;
            border-bottom: 1px solid #e2e7ea;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .header-inner {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
        }

        .site-title {
            text-decoration: none;
            color: #555858;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            letter-spacing: 0.1em;
        }

        .header-nav {
            display: flex;
            gap: 8px;
        }

        .header-nav a {
            text-decoration: none;
            color: #878c8c;
            font-size: 12px;
            padding: 8px 12px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .header-nav a:hover,
        .header-nav a.active {
            background: #f3f5f4;
            color: #555858;
        }

        .hero {
            text-align: center;
            padding: 20px 24px 16px;
            background: linear-gradient(135deg, #f8f9fa 0%, #edf2f7 100%);
            margin: -24px -24px 8px -24px;
            border-bottom: 1px solid #e2e7ea;
        }

        .hero-title {
            font-size: 20px;
            color: #2c3e50;
            margin: 0 0 8px 0;
            font-weight: 900;
            letter-spacing: 0.1em;
            line-height: 1.4;
        }

        .hero-desc {
            font-size: 12px;
            color: #555858;
            margin: 0;
            line-height: 1.8;
            letter-spacing: 0.05em;
            font-weight: 500;
        }

        /* --- 区ナビゲーション --- */
        .ward-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: center;
            margin: 16px 0 24px;
            padding: 0 8px;
        }

        .ward-nav-link {
            padding: 8px 14px;
            text-decoration: none;
            border: 1px solid #e2e7ea;
            background: #ffffff;
            font-size: 13px;
            color: #878c8c;
            border-radius: 4px;
            transition: all 0.3s ease;
            letter-spacing: 0.05em;
        }

        .ward-nav-link:hover {
            color: #555858;
            background: #f3f5f4;
            border-color: #d1d8dc;
        }

        .ward-nav-link.active {
            color: #ffffff;
            border-color: #2d7cbc;
            background: #2d7cbc;
        }

        .ward-nav-all {
            font-weight: 600;
        }

        /* --- breadcrumb --- */
        .breadcrumb {
            font-size: 12px;
            color: #888;
            margin: 16px 0 8px;
            padding: 0;
        }
        .breadcrumb a {
            color: #2d7cbc;
            text-decoration: none;
        }
        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .app-title-area {
            text-align: center;
            margin-bottom: 24px;
        }

        .app-title {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 12px;
            font-weight: 800;
            letter-spacing: 0.05em;
        }

        .app-desc {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-bottom: 24px;
        }

        .tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            margin-bottom: 24px;
        }

        .tab-btn {
            padding: 10px 18px;
            cursor: pointer;
            border: 1px solid #e2e7ea;
            background: #ffffff;
            font-size: 13px;
            color: #878c8c;
            border-radius: 4px;
            transition: all 0.3s ease;
            letter-spacing: 0.05em;
        }

        .tab-btn:hover {
            color: #555858;
            background: #f3f5f4;
            border-color: #d1d8dc;
        }

        .tab-btn.active {
            color: #ffffff;
            border-color: #2d7cbc;
            background: #2d7cbc;
        }

        .notice {
            font-size: 14px;
            color: #2c3e50;
            background: #ffffff;
            padding: 20px 24px;
            border-radius: 8px;
            margin: 16px auto 30px;
            line-height: 1.8;
            max-width: 900px;
            text-align: left;
            border: 2px solid #e2e7ea;
            border-left: 6px solid #2d7cbc;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .notice b {
            color: #555858;
            font-size: 14px;
            font-weight: 700;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            min-width: 140px;
            flex: 1;
            max-width: 220px;
        }

        .section-label {
            font-size: 12px;
            font-weight: bold;
            color: #2980b9;
            margin: 12px 0 4px;
            padding-left: 2px;
            letter-spacing: 0.05em;
        }

        /* ======= 施設詳細モーダル ======= */
        .modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, .5);
            z-index: 500;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }

        .modal-overlay.open {
            display: flex;
        }

        .modal {
            background: white;
            border-radius: 8px;
            max-width: 480px;
            width: 100%;
            padding: 32px 24px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-close {
            position: absolute;
            top: 14px;
            right: 16px;
            font-size: 22px;
            cursor: pointer;
            color: #999;
            border: none;
            background: none;
            line-height: 1;
        }

        .modal-close:hover {
            color: #333;
        }

        .modal h2 {
            font-size: 17px;
            color: #2c3e50;
            margin: 0 28px 12px 0;
            line-height: 1.4;
        }

        .modal-badge {
            display: inline-block;
            background: #e2e7ea;
            color: #555858;
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 4px;
            margin-bottom: 12px;
            letter-spacing: 0.05em;
        }

        .modal-vac-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 4px;
            background: #fbfbfc;
            border-radius: 4px;
            padding: 12px;
            margin: 16px 0;
            border: 1px solid #e2e7ea;
        }

        .modal-vac-cell {
            text-align: center;
        }

        .modal-vac-label {
            font-size: 10px;
            color: #888;
        }

        .modal-vac-num {
            font-size: 18px;
            font-weight: bold;
        }

        .modal-vac-num.ok { color: #27ae60; }
        .modal-vac-num.zero { color: #333; }
        .modal-vac-num.na { color: #ccc; font-size: 13px; }

        .modal-info {
            border-top: 1px solid #eee;
            padding-top: 12px;
        }

        .modal-row {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            align-items: flex-start;
            font-size: 14px;
        }

        .modal-row a { color: #2980b9; }

        .modal-icon {
            font-size: 16px;
            flex-shrink: 0;
            width: 24px;
        }

        .modal-val {
            color: #333;
            line-height: 1.5;
        }

        .modal-map-btn {
            display: block;
            margin-top: 12px;
            background: #ffffff;
            color: #555858;
            border: 1px solid #e2e7ea;
            text-align: center;
            padding: 12px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            transition: all .3s;
            letter-spacing: 0.05em;
        }

        .modal-map-btn:hover {
            background: #f3f5f4;
            color: #2d7cbc;
            border-color: #2d7cbc;
        }

        .modal-hp-btn {
            display: block;
            margin-top: 10px;
            background: #2d7cbc;
            color: white;
            border: 1px solid #2d7cbc;
            text-align: center;
            padding: 12px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            transition: all .3s;
            letter-spacing: 0.05em;
        }

        .modal-hp-btn:hover {
            background: #236194;
            border-color: #236194;
        }

        .nursery-link {
            cursor: pointer;
            color: #555858;
            text-decoration: underline;
            text-underline-offset: 4px;
            transition: color 0.3s ease;
        }

        .nursery-link:hover { color: #878c8c; }

        /* ======= テーブル（PC） ======= */
        .table-wrapper {
            overflow-x: auto;
            overflow-y: auto;
            max-height: calc(100vh - 340px);
            min-height: 300px;
            border-radius: 4px;
            border: 1px solid #e2e7ea;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 480px;
        }

        thead th {
            background: #f8f9fa;
            color: #555858;
            padding: 12px 6px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 10;
            cursor: pointer;
            user-select: none;
            font-size: 14px;
            border-bottom: 2px solid #e2e7ea;
            letter-spacing: 0.05em;
        }

        thead th:hover { background: #e2e7ea; }

        td {
            padding: 14px 6px;
            text-align: center;
            border-bottom: 1px solid #f3f5f4;
            font-size: 14px;
        }

        td.school-name {
            text-align: left;
            font-weight: 600;
            color: #2980b9;
            font-size: 14px;
        }

        tbody tr:nth-child(even) { background: #fbfbfc; }
        tbody tr:hover { background: #f3f5f4; }

        .vac-ok { color: #7ea482; font-size: 1.2em; font-weight: bold; }
        .vac-zero { color: #bbb; font-size: 1.2em; font-weight: normal; }
        .vac-na { color: #bbb; }
        td.vac-cell { padding: 6px 4px; }

        /* ======= スマホ カード ======= */
        .card-list { display: none; }

        .card-wrapper {
            display: none;
            border: 1px solid #e2e7ea;
            border-radius: 4px;
            overflow: hidden;
        }

        .card-sort-header {
            display: none;
            background: #f8f9fa;
            border-bottom: 2px solid #e2e7ea;
            padding: 4px 0;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .card-sort-row {
            display: grid;
            grid-template-columns: 2fr repeat(6, 1fr);
            gap: 0;
        }

        .card-sort-th {
            text-align: center;
            color: #555858;
            font-weight: bold;
            font-size: 12px;
            padding: 8px 2px;
            cursor: pointer;
            border-right: 1px solid #e2e7ea;
            user-select: none;
        }

        .card-sort-th:last-child { border-right: none; }
        .card-sort-th:hover { background: #e2e7ea; }
        .card-sort-th.active { background: #d1d8dc; }

        .card-row {
            display: grid;
            grid-template-columns: 2fr repeat(6, 1fr);
            border-bottom: 1px solid #f3f5f4;
        }

        .card-name {
            font-weight: 500;
            color: #555858;
            font-size: 12px;
            padding: 14px 8px;
            text-align: left;
            display: flex;
            align-items: center;
            border-right: 1px solid #f3f5f4;
        }

        .card-vac {
            text-align: center;
            padding: 8px 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #f3f5f4;
            font-size: 15px;
            font-weight: bold;
        }

        .card-vac:last-child { border-right: none; }
        .card-vac.ok { color: #7ea482; font-size: 1.15em; }
        .card-vac.zero { color: #bbb; font-weight: normal; }
        .card-vac.na { color: #ccc; font-size: 12px; }

        .card-row:nth-child(even) .card-name,
        .card-row:nth-child(even) .card-vac { background: #fbfbfc; }

        .total-row {
            display: grid;
            grid-template-columns: 2fr repeat(6, 1fr);
            background: #e8f4f8;
            border: 1px solid #3498db;
            border-top: 2px solid #3498db;
            border-radius: 0 0 8px 8px;
        }

        .total-row-label {
            font-weight: bold;
            color: #2980b9;
            font-size: 12px;
            padding: 8px 8px;
            text-align: left;
            display: flex;
            align-items: center;
            border-right: 1px solid #cce0f0;
        }

        .total-row-val {
            text-align: center;
            padding: 8px 2px;
            font-size: 15px;
            font-weight: bold;
            color: #555858;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #e2e7ea;
        }

        .total-row-val:last-child { border-right: none; }

        tfoot { position: sticky; bottom: 0; z-index: 10; }

        tfoot td {
            background: #fbfbfc;
            border-top: 1px solid #e2e7ea;
            border-bottom: none;
        }

        .card-total-row { display: none; }

        .card-total-label {
            font-weight: 500;
            color: #555858;
            font-size: 12px;
            padding: 10px 8px;
            text-align: left;
            display: flex;
            align-items: center;
            border-right: 1px solid #f3f5f4;
        }

        .card-total-val {
            text-align: center;
            padding: 8px 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #f3f5f4;
            font-size: 12px;
            font-weight: bold;
        }

        .card-total-val:last-child { border-right: none; }
        .card-total-val.ok { color: #7ea482; font-size: 1.05em; }
        .card-total-val.zero { color: #bbb; font-weight: normal; }

        .controls-row {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .search-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .search-icon {
            position: absolute;
            left: 10px;
            color: #aaa;
            pointer-events: none;
        }

        .search-input {
            padding: 8px 10px 8px 32px;
            border: 1px solid #e2e7ea;
            border-radius: 4px;
            font-size: 14px;
            width: 100%;
            transition: border-color 0.3s;
        }

        .search-input:focus {
            outline: none;
            border-color: #2d7cbc;
        }

        #age-filter {
            padding: 8px 10px;
            border: 1px solid #e2e7ea;
            border-radius: 4px;
            font-size: 14px;
            background: #fff;
        }

        @media (max-width:560px) {
            body {
                padding: 8px;
                padding-bottom: 72px;
            }

            .container {
                padding: 16px;
                border-radius: 4px;
                border: none;
            }

            h1 { font-size: 17px; }
            .table-wrapper { display: none; }
            .card-list { display: block; }
            .card-sort-header { display: block; }

            .tab-btn {
                font-size: 12px;
                padding: 6px 10px;
            }

            .filter-group { max-width: 100%; }

            .card-total-row {
                display: grid;
                grid-template-columns: 2fr repeat(6, 1fr);
                position: sticky;
                bottom: 0;
                z-index: 40;
                background: #fbfbfc;
                border-top: 1px solid #e2e7ea;
            }

            .card-wrapper {
                display: block;
                overflow-y: auto;
                max-height: calc(100vh - 320px);
                min-height: 200px;
            }

            .card-list { display: block; }
            .card-sort-header { display: block; }

            .header-inner {
                flex-direction: column;
                gap: 12px;
                padding: 12px;
            }

            .ward-nav-link {
                font-size: 12px;
                padding: 6px 10px;
            }
        }

        .site-footer {
            background: #f8f9fa;
            border-top: 1px solid #e2e7ea;
            padding: 24px 16px;
            text-align: center;
            margin: 40px -24px -24px;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: #878c8c;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }

        .footer-links a:hover { color: #2d7cbc; }

        .footer-copy {
            color: #aaa;
            font-size: 11px;
        }
    </style>
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9933757915252942"
         crossorigin="anonymous"></script>
</head>

<body>
    <!-- サイト全体のヘッダー -->
    <header class="app-header">
        <div class="header-inner">
            <a href="index.html" class="site-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>世田谷保育ナビ</a>
            <nav class="header-nav">
                <a href="guide.html"><svg width="14" height="14" style="vertical-align:-2px;margin-right:2px;"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>初めてガイド</a>
                <a href="criteria.html"><svg width="14" height="14" style="vertical-align:-2px;margin-right:2px;"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="16" y1="14" x2="16" y2="14.01" />
                        <line x1="12" y1="14" x2="12" y2="14.01" />
                        <line x1="8" y1="14" x2="8" y2="14.01" />
                        <line x1="16" y1="10" x2="16" y2="10.01" />
                        <line x1="12" y1="10" x2="12" y2="10.01" />
                        <line x1="8" y1="10" x2="8" y2="10.01" />
                        <line x1="16" y1="18" x2="16" y2="18.01" />
                        <line x1="12" y1="18" x2="12" y2="18.01" />
                        <line x1="8" y1="18" x2="8" y2="18.01" />
                    </svg>点数計算</a>
                <a href="index.html" class="active"><svg width="14" height="14"
                        style="vertical-align:-2px;margin-right:2px;" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>空き状況</a>
                <a href="column.html"><svg width="14" height="14" style="vertical-align:-2px;margin-right:2px;"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>コラム</a>
            </nav>
        </div>
    </header>

    <div class="container">
        <div class="breadcrumb">
            <a href="index.html">トップ</a> &gt; ${ward.name} 保育園 空き状況
        </div>

        <div class="hero">
            <h1 class="hero-title">世田谷区${ward.name} 保育園 空き状況</h1>
            <p class="hero-desc">令和7年度の最新データをもとに、${ward.name}の保育園を年齢・施設種別ですぐに検索できます。</p>
        </div>

        <!-- 区ナビゲーション -->
${wardNav}

        <div class="section-label" id="label-cat">🏢 施設種別</div>
        <div class="tabs" id="category-tabs" role="tablist" aria-labelledby="label-cat">
            <button class="tab-btn active" role="tab" aria-selected="true" onclick="switchTab('all')">すべて</button>
            <button class="tab-btn" role="tab" aria-selected="false" onclick="switchTab('認可保育所')">認可保育所</button>
            <button class="tab-btn" role="tab" aria-selected="false" onclick="switchTab('認定こども園')">こども園</button>
            <button class="tab-btn" role="tab" aria-selected="false" onclick="switchTab('小規模保育事業所')">小規模保育</button>
        </div>

        <div class="controls-row">
            <div class="filter-group">
                <label for="age-filter">🎒 年齢</label>
                <select id="age-filter" onchange="filterTable()" aria-label="年齢で絞り込む">
                    <option value="all">すべての年齢</option>
                    <option value="0">0歳児</option>
                    <option value="1">1歳児</option>
                    <option value="2">2歳児</option>
                    <option value="3">3歳児</option>
                    <option value="4">4歳児</option>
                    <option value="5">5歳児</option>
                </select>
            </div>
            <div class="filter-group">
                <div class="search-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="search-icon" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="name-filter" class="search-input" placeholder="保育園名で検索..."
                        onkeyup="filterTable()" aria-label="保育園名で検索">
                </div>
            </div>
        </div>

        <div class="notice">
            <b><svg width="20" height="20" style="margin-right:6px;vertical-align:-4px;color:#2d7cbc;"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>データの見方について</b><br>
            空きあり（数字）、<span style="color:#555858;">空きなし（0）</span>、<span
                style="color:#aaa;">対象外（-）</span>で表示しています。見出し（年齢など）をタップすると並び替えができます。園名を押すと詳細が見られます。（令和7年度4月2次利用調整時点）
        </div>

        <div class="table-wrapper box-shadow">
            <table id="nursery-table" aria-label="${ward.name}の保育園空き状況一覧">
                <thead>
                    <tr>
                        <th class="school-name sort-btn" onclick="sortTable('name')" id="th-name" role="button"
                            tabindex="0">
                            園名・種類・住所 <span class="sort-icon">↕</span>
                        </th>
                        <th onclick="sortTable('0')" class="sort-btn" id="th-0" role="button" tabindex="0">0歳 <span
                                class="sort-icon">↕</span></th>
                        <th onclick="sortTable('1')" class="sort-btn" id="th-1" role="button" tabindex="0">1歳 <span
                                class="sort-icon">↕</span></th>
                        <th onclick="sortTable('2')" class="sort-btn" id="th-2" role="button" tabindex="0">2歳 <span
                                class="sort-icon">↕</span></th>
                        <th onclick="sortTable('3')" class="sort-btn" id="th-3" role="button" tabindex="0">3歳 <span
                                class="sort-icon">↕</span></th>
                        <th onclick="sortTable('4')" class="sort-btn" id="th-4" role="button" tabindex="0">4歳 <span
                                class="sort-icon">↕</span></th>
                        <th onclick="sortTable('5')" class="sort-btn" id="th-5" role="button" tabindex="0">5歳 <span
                                class="sort-icon">↕</span></th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
                <tfoot>
                    <tr>
                        <td style="text-align:left; font-weight:bold; color:#555858; padding-left:10px;"><svg width="14"
                                height="14" style="margin-right:4px;vertical-align:-1px;" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="12" y1="20" x2="12" y2="10" />
                                <line x1="18" y1="20" x2="18" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="16" />
                            </svg>空き合計</td>
                        <td id="tbar-0">0</td>
                        <td id="tbar-1">0</td>
                        <td id="tbar-2">0</td>
                        <td id="tbar-3">0</td>
                        <td id="tbar-4">0</td>
                        <td id="tbar-5">0</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- スマホ カード -->
        <div class="card-wrapper">
            <div class="card-sort-header" id="card-sort-header">
                <div class="card-sort-row">
                    <div class="card-sort-th" onclick="sortTable('name')" id="csh-name">園名 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('0')" id="csh-0">0歳 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('1')" id="csh-1">1歳 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('2')" id="csh-2">2歳 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('3')" id="csh-3">3歳 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('4')" id="csh-4">4歳 ↕</div>
                    <div class="card-sort-th" onclick="sortTable('5')" id="csh-5">5歳 ↕</div>
                </div>
            </div>
            <div class="card-list" id="card-list"></div>

            <div class="card-total-row">
                <div class="card-total-label"><svg width="14" height="14" style="margin-right:4px;vertical-align:-2px;"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="12" y1="20" x2="12" y2="10" />
                        <line x1="18" y1="20" x2="18" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>合計</div>
                <div id="mbar-0" class="card-total-val zero">-</div>
                <div id="mbar-1" class="card-total-val zero">-</div>
                <div id="mbar-2" class="card-total-val zero">-</div>
                <div id="mbar-3" class="card-total-val zero">-</div>
                <div id="mbar-4" class="card-total-val zero">-</div>
                <div id="mbar-5" class="card-total-val zero">-</div>
            </div>
        </div>

        <!-- 空き状況を見た後の次のアクション -->
        <div style="margin-top: 48px; padding: 32px 16px; border-top: 1px solid #e2e7ea; background:#fefcf3; border-radius:12px; border:1px solid #f0e6c8;">
            <h2 style="text-align:center; font-size:18px; color:#2c3e50; font-weight:800; margin-bottom:6px;">空き状況を確認した、次にやること</h2>
            <p style="text-align:center; font-size:12px; color:#888; margin-bottom:20px;">保育園選びは「空きがある＝入れる」ではありません</p>
            <div style="display:flex; flex-direction:column; gap:10px; max-width:500px; margin:0 auto 16px;">
                <a href="criteria.html" style="text-decoration:none; display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e2e7ea; border-radius:8px; padding:14px 16px; transition:all 0.3s;">
                    <span style="background:#e8f4fd; color:#2d7cbc; font-size:13px; font-weight:800; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">1</span>
                    <span style="flex:1;"><span style="font-size:14px; font-weight:700; color:#2c3e50; display:block; line-height:1.3;">自分の点数を計算する</span><span style="font-size:11px; color:#888;">選考は点数制。まず自分が何点か知ろう</span></span>
                    <span style="color:#ccc; font-size:16px;">›</span>
                </a>
                <a href="article_52points.html" style="text-decoration:none; display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e2e7ea; border-radius:8px; padding:14px 16px; transition:all 0.3s;">
                    <span style="background:#e8f4fd; color:#2d7cbc; font-size:13px; font-weight:800; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">2</span>
                    <span style="flex:1;"><span style="font-size:14px; font-weight:700; color:#2c3e50; display:block; line-height:1.3;">52点で入れる？ボーダーラインを知る</span><span style="font-size:11px; color:#888;">点数が同じ場合の優先順位ルールも解説</span></span>
                    <span style="color:#ccc; font-size:16px;">›</span>
                </a>
                <a href="article-kengaku.html" style="text-decoration:none; display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e2e7ea; border-radius:8px; padding:14px 16px; transition:all 0.3s;">
                    <span style="background:#e8f4fd; color:#2d7cbc; font-size:13px; font-weight:800; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">3</span>
                    <span style="flex:1;"><span style="font-size:14px; font-weight:700; color:#2c3e50; display:block; line-height:1.3;">気になる園を見学する</span><span style="font-size:11px; color:#888;">聞くべき質問38項目チェックリスト付き</span></span>
                    <span style="color:#ccc; font-size:16px;">›</span>
                </a>
                <a href="article-narashi.html" style="text-decoration:none; display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e2e7ea; border-radius:8px; padding:14px 16px; transition:all 0.3s;">
                    <span style="background:#e8f4fd; color:#2d7cbc; font-size:13px; font-weight:800; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">4</span>
                    <span style="flex:1;"><span style="font-size:14px; font-weight:700; color:#2c3e50; display:block; line-height:1.3;">入園後の慣らし保育に備える</span><span style="font-size:11px; color:#888;">復職日はいつにすべき？失敗しないスケジュール</span></span>
                    <span style="color:#ccc; font-size:16px;">›</span>
                </a>
            </div>
            <p style="text-align:center; margin:0;"><a href="column.html" style="font-size:13px; color:#2d7cbc; text-decoration:none; font-weight:500;">もっと読む：入園準備・お金・グッズ情報 →</a></p>
        </div>

        <footer class="site-footer">
            <div class="footer-links">
                <a href="privacy.html">プライバシーポリシー</a>
                <a href="contact.html">お問い合わせ</a>
            </div>
            <p class="footer-copy">&copy; 2026 世田谷保育ナビ</p>
        </footer>
    </div>

    <!-- 施設詳細モーダル -->
    <div class="modal-overlay" id="modal-overlay" onclick="closeModal(event)" aria-hidden="true" role="dialog"
        aria-modal="true" aria-labelledby="modal-name">
        <div class="modal" id="modal-box" role="document">
            <button class="modal-close" onclick="closeModalBtn()" aria-label="閉じる">✕</button>
            <div class="modal-badge" id="modal-badge" aria-hidden="true"></div>
            <h2 id="modal-name"></h2>
            <div class="modal-vac-grid" id="modal-vac"></div>
            <div class="modal-info">
                <div class="modal-row"><span class="modal-icon" style="color:#2d7cbc;"><svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg></span><span class="modal-val" id="modal-address"></span></div>
                <div class="modal-row"><span class="modal-icon" style="color:#2d7cbc;"><svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg></span><span class="modal-val" id="modal-phone"></span></div>
                <div class="modal-row"><span class="modal-icon" style="color:#2d7cbc;"><svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg></span><span class="modal-val" id="modal-age"></span>
                </div>
                <div class="modal-row"><span class="modal-icon" style="color:#2d7cbc;"><svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg></span><span class="modal-val" id="modal-cap"></span>
                </div>
            </div>
            <a class="modal-map-btn" id="modal-map" href="#" target="_blank" rel="noopener"><svg width="14" height="14"
                    style="margin-right:6px;vertical-align:-1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                </svg>Googleマップで見る</a>
            <a class="modal-hp-btn" id="modal-hp" href="#" target="_blank" rel="noopener"><svg width="14" height="14"
                    style="margin-right:6px;vertical-align:-1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>公式HPを検索</a>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="facility_info.js"></script>
    <script>
        const WARD_NAME = '${ward.name}';

        let currentData = [];
        let currentCategory = 'all';
        let currentSort = { key: null, asc: true };
        window._vacMap = {};

        const tableBody = document.querySelector('#nursery-table tbody');
        const cardList = document.getElementById('card-list');

        // 初期表示
        updateCurrentData();
        renderAll(currentData);

        function switchTab(type) {
            currentCategory = type;
            document.querySelectorAll('#category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(\`#category-tabs .tab-btn[onclick="switchTab('\${type}')"]\`).classList.add('active');
            reset();
        }

        function reset() {
            document.getElementById('age-filter').value = 'all';
            document.getElementById('name-filter').value = '';
            currentSort = { key: null, asc: true };
            updateSortUI(null);
            updateCurrentData();
            filterTable();
        }

        function updateCurrentData() {
            const auth = (typeof authorizedNurseries !== 'undefined') ? authorizedNurseries : [];
            const wardData = auth.filter(n => n.ward === WARD_NAME);
            currentData = currentCategory === 'all'
                ? wardData
                : wardData.filter(n => n.category === currentCategory);
        }

        function vacClass(vac) {
            if (vac == null) return 'na';
            if (vac > 0) return 'ok';
            return 'zero';
        }

        function renderTable(data) {
            tableBody.innerHTML = '';
            window._vacMap = {};
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="padding:20px;color:#aaa">データがありません</td></tr>';
                return;
            }
            data.forEach((n, i) => {
                window._vacMap[i] = n;
                const tr = document.createElement('tr');
                const cells = ['0', '1', '2', '3', '4', '5'].map(a => {
                    if (!n[a] || n[a].vac == null) return \`<td class="vac-cell"><span class="vac-na">-</span></td>\`;
                    const cls = vacClass(n[a].vac);
                    return \`<td class="vac-cell"><span class="vac-\${cls}">\${n[a].vac}</span></td>\`;
                }).join('');
                const nameCell = document.createElement('td');
                nameCell.className = 'school-name';
                nameCell.style.paddingLeft = '10px';
                const link = document.createElement('span');
                link.className = 'nursery-link';
                link.textContent = n.name;
                link.addEventListener('click', () => showDetail(i));
                nameCell.appendChild(link);
                tr.appendChild(nameCell);
                tr.insertAdjacentHTML('beforeend', cells);
                tableBody.appendChild(tr);
            });
        }

        function renderCards(data) {
            cardList.innerHTML = '';
            if (data.length === 0) {
                cardList.innerHTML = '<p style="text-align:center;color:#aaa;padding:16px">データがありません</p>';
                return;
            }
            const totals = calcTotals(data);
            data.forEach((n, i) => {
                window._vacMap[i] = n;
                const row = document.createElement('div');
                row.className = 'card-row';
                const ageVacs = ['0', '1', '2', '3', '4', '5'].map(a => {
                    if (!n[a] || n[a].vac == null) return \`<div class="card-vac na">-</div>\`;
                    const cls = vacClass(n[a].vac);
                    return \`<div class="card-vac \${cls}">\${n[a].vac}</div>\`;
                }).join('');
                const nameDiv = document.createElement('div');
                nameDiv.className = 'card-name';
                const link = document.createElement('span');
                link.className = 'nursery-link';
                link.textContent = n.name;
                link.addEventListener('click', () => showDetail(i));
                nameDiv.appendChild(link);
                row.appendChild(nameDiv);
                row.insertAdjacentHTML('beforeend', ageVacs);
                cardList.appendChild(row);
            });
            const totalRow = document.createElement('div');
            totalRow.className = 'total-row';
            const totalVacs = ['0', '1', '2', '3', '4', '5'].map(a =>
                \`<div class="total-row-val">\${totals[a]}</div>\`
            ).join('');
            totalRow.innerHTML = \`<div class="total-row-label">合計</div>\${totalVacs}\`;
            cardList.appendChild(totalRow);
        }

        function calcTotals(data) {
            const t = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
            data.forEach(n => ['0', '1', '2', '3', '4', '5'].forEach(a => {
                if (n[a]?.vac > 0) t[a] += n[a].vac;
            }));
            return t;
        }

        function updateTotalBar(totals) {
            ['0', '1', '2', '3', '4', '5'].forEach(a => {
                const tb = document.getElementById(\`tbar-\${a}\`);
                if (tb) {
                    tb.textContent = totals[a];
                    tb.className = (totals[a] > 0) ? 'vac-ok' : 'vac-zero';
                }
                const mb = document.getElementById(\`mbar-\${a}\`);
                if (mb) {
                    mb.textContent = totals[a];
                    mb.className = (totals[a] > 0) ? 'card-total-val ok' : 'card-total-val zero';
                }
            });
        }

        function renderAll(data) {
            renderTable(data);
            renderCards(data);
            updateTotalBar(calcTotals(data));
        }

        function updateSortUI(key) {
            document.querySelectorAll('.card-sort-th').forEach(el => el.classList.remove('active'));
            if (key !== null) {
                const id = key === 'name' ? 'csh-name' : \`csh-\${key}\`;
                const el = document.getElementById(id);
                if (el) el.classList.add('active');
            }
        }

        function sortTable(key) {
            currentSort.asc = currentSort.key === key ? !currentSort.asc : false;
            currentSort.key = key;
            updateSortUI(key);
            filterTable();
        }

        function filterTable() {
            const age = document.getElementById('age-filter').value;
            const name = document.getElementById('name-filter').value;
            let filtered = currentData.filter(n => {
                const matchName = n.name.includes(name);
                const matchAge = age === 'all' || (n[age] && n[age].vac > 0);
                return matchName && matchAge;
            });
            if (currentSort.key) {
                filtered.sort((a, b) => {
                    const va = currentSort.key === 'name' ? a.name : (a[currentSort.key]?.vac ?? -1);
                    const vb = currentSort.key === 'name' ? b.name : (b[currentSort.key]?.vac ?? -1);
                    if (va < vb) return currentSort.asc ? -1 : 1;
                    if (va > vb) return currentSort.asc ? 1 : -1;
                    return 0;
                });
            }
            renderAll(filtered);
        }

        // =============================================
        // 施設詳細モーダル
        // =============================================
        function getFacilityInfo(name) {
            if (typeof facilityInfo === 'undefined') return null;
            let f = facilityInfo.find(f => f.name === name);
            if (f) return f;
            f = facilityInfo.find(f =>
                name.endsWith(f.name) || f.name.endsWith(name) ||
                name.includes(f.name) || f.name.includes(name)
            );
            return f || null;
        }

        function showDetail(idx) {
            const vacData = window._vacMap[idx];
            if (!vacData) return;
            const name = vacData.name;
            const info = getFacilityInfo(name);

            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-badge').textContent =
                info ? info.category : (vacData.category || '施設情報');

            const grid = document.getElementById('modal-vac');
            grid.innerHTML = ['0', '1', '2', '3', '4', '5'].map(a => {
                const d = vacData[a];
                if (!d || d.vac == null) return \`<div class="modal-vac-cell"><div class="modal-vac-label">\${a}歳</div><div class="modal-vac-num na">-</div></div>\`;
                const cls = d.vac > 0 ? 'ok' : 'zero';
                return \`<div class="modal-vac-cell"><div class="modal-vac-label">\${a}歳</div><div class="modal-vac-num \${cls}">\${d.vac}</div></div>\`;
            }).join('');

            document.getElementById('modal-address').textContent = info?.address || '情報なし';
            document.getElementById('modal-phone').innerHTML = info?.phone
                ? \`<a href="tel:\${info.phone}">\${info.phone}</a>\` : '情報なし';
            document.getElementById('modal-age').textContent = info?.age || '情報なし';
            document.getElementById('modal-cap').textContent = info?.capacity ? \`定員 \${info.capacity}名\` : '情報なし';

            const mapSearchText = info?.address ? \`\${name} \${info.address}\` : \`世田谷区 \${name}\`;
            document.getElementById('modal-map').href = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(mapSearchText)}\`;

            const hpBtn = document.getElementById('modal-hp');
            if (info?.url) {
                hpBtn.href = info.url;
                hpBtn.innerHTML = '🌐 公式サイトを見る';
                hpBtn.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
            } else {
                let address = info?.address || '';
                let phone = info?.phone || '';
                let query = \`世田谷区 \${name} \${address} \${phone} 公式\`;
                hpBtn.href = \`https://www.google.com/search?q=\${encodeURIComponent(query)}\`;
                hpBtn.innerHTML = '🔍 公式HPをGoogleで検索';
                hpBtn.style.background = 'linear-gradient(135deg, #607d8b, #455a64)';
            }

            document.getElementById('modal-overlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(e) {
            if (e.target === document.getElementById('modal-overlay')) closeModalBtn();
        }
        function closeModalBtn() {
            document.getElementById('modal-overlay').classList.remove('open');
            document.body.style.overflow = '';
        }
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalBtn(); });
    </script>
</body>

</html>`;
}

// 生成実行
const outDir = path.resolve(__dirname, '..');
wards.forEach(ward => {
  const html = generatePage(ward);
  const filePath = path.join(outDir, `ward-${ward.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`Generated: ward-${ward.slug}.html`);
});

console.log(`\nDone! ${wards.length} ward pages generated.`);
