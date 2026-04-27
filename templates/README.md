# テンプレート利用ガイド

## 概要

さいたま市で確立した勝ちパターンを他市に横展開するためのテンプレート集です。

## プレースホルダー一覧

| プレースホルダー | 説明 | さいたま市での値 |
|---|---|---|
| {{SITE_NAME}} | サイト名 | さいたま保育ナビ |
| {{SITE_URL}} | サイトURL | https://nursery.root-for.jp/ |
| {{GA_TRACKING_ID}} | GA4トラッキングID | G-KK8KHXY1CK |
| {{CITY_NAME}} | 市区町村名 | さいたま市 |
| {{WARD_NAME}} | 区名 | 見沼区 |
| {{WARD_AREAS}} | エリア名 | 東大宮・七里・大和田 |
| {{WARD_DESCRIPTION}} | 区の説明 | — |
| {{WARD_POINT_1}} | 保活ポイント1 | — |
| {{WARD_POINT_2}} | 保活ポイント2 | — |
| {{WARD_POINT_3}} | 保活ポイント3 | — |
| {{ARTICLE_TITLE}} | 記事タイトル | — |
| {{ARTICLE_DESCRIPTION}} | meta description | — |
| {{KEYWORDS}} | meta keywords | — |
| {{CANONICAL_URL}} | canonical URL | — |
| {{OG_IMAGE_URL}} | OG画像URL | — |
| {{DATE_PUBLISHED}} | 公開日 | 2026-04-08 |
| {{DATE_MODIFIED}} | 更新日 | 2026-04-08 |
| {{BADGE_TEXT}} | 記事バッジ | 保活ガイド |
| {{H1_TITLE}} | H1テキスト | — |

## 横展開手順

1. 対象市のフォルダを作成（例: `setagaya-hoiku-navi/`）
2. テンプレートをコピーし、プレースホルダーを置換
3. `data.js` に対象市のデータを格納
4. `facility_info.js` に施設情報を格納
5. 市固有の記事内容（区の特徴等）を編集
6. 汎用記事（育休・申し込み方法等）はそのまま流用可能

## 展開先の優先順位

待機児童数に基づくランキング（2025年4月時点）：

1. 世田谷区（47人）
2. 町田市（40人）
3. 白岡市（36人）
4. 船橋市（34人）
5. 鎌倉市（34人）
6. 北本市（32人）
7. 日野市（30人）
8. 座間市（30人）
9. 草加市（24人）
10. 八千代市（16人）

## ファイル構成

- `article-template.html` — 記事ページのテンプレート
- `ward-template.html` — 区/地区ページのテンプレート
- `README.md` — このファイル
