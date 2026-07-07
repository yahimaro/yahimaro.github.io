---
name: sitemap-update
description: >-
  Update sitemap.xml whenever pages on the yahimaro.com marketing site
  (yahimaro.github.io repo) are added, edited, or removed. Use after editing
  any .html page, adding a new page/directory, or before committing HP changes.
  Keeps <lastmod> accurate and adds/removes <url> entries so that IndexNow (the
  GitHub Actions workflow) notifies search engines of exactly the changed URLs.
  Triggers on: HP/LP/サイト更新, ページ追加, 記事公開, blog投稿, sitemap, SEO更新.
---

# sitemap-update — HP更新後に sitemap.xml を必ず更新する

yahimaro.com（`yahimaro.github.io` リポジトリ）のページを**追加・編集・削除したら、
コミット前に必ず `sitemap.xml` を更新する**ためのスキル。

なぜ必須か：IndexNow の GitHub Actions（`.github/workflows/indexnow.yml`）は
**`sitemap.xml` の差分をトリガに、変更された `<loc>` だけ**を検索エンジンへ通知する。
sitemap を更新しないと、ページを直しても検索エンジンに再クロールが通知されない。

## 手順（3ステップ）

### 1. 変更したページに対応する `<url>` を特定する

URL とファイルの対応関係（`<loc>` からファイルを逆引き）:

| `<loc>` の形 | 対応ファイル | 例 |
|---|---|---|
| `https://yahimaro.com/` | `index.html` | トップ |
| `https://yahimaro.com/path/` | `path/index.html` | `/blog/` → `blog/index.html` |
| `https://yahimaro.com/name` | `name.html` | `/support` → `support.html` |
| `https://yahimaro.com/dir/name.html` | `dir/name.html` | `/stocker-biz/contact.html` |

### 2. `<lastmod>` を当日日付（`YYYY-MM-DD`）に更新する

- **編集したページ** → その `<url>` の `<lastmod>` を今日の日付に書き換える。
- **新規ページ** → 新しい `<url>` ブロックを追加する（下記テンプレ）。
- **削除したページ** → 該当 `<url>` ブロックを削除する。
- 触っていないページの `<lastmod>` は**変えない**（差分を最小に保つ＝IndexNow が余計なURLを送らない）。

新規 `<url>` テンプレート（`priority` は下の目安を参照）:

```xml
  <url>
    <loc>https://yahimaro.com/新しいパス/</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

`priority` の目安（既存の値に合わせる）:

| 種類 | priority | changefreq |
|---|---|---|
| トップ | 1.0 | weekly |
| 主要LP（/stocker/, /stocker-biz/） | 0.9 | weekly |
| 機能・事例・ガイド・blog一覧 | 0.8 | monthly/weekly |
| 個別記事（blog記事・tips） | 0.7 | monthly |
| 問い合わせ・サポート | 0.5 | monthly/yearly |
| 規約・プライバシー・特商法 | 0.3 | yearly |

### 3. コミット & push

`sitemap.xml` を含めて push すれば、IndexNow ワークフローが自動起動し、
`<lastmod>` を変えた URL だけが検索エンジンへ通知される。

## 注意点

- **Google は IndexNow 非対応**。通知が効くのは Bing・Yandex 等。Google は従来どおり
  sitemap クロール＋Search Console 頼み（だが sitemap の `<lastmod>` 更新は Google にも有効）。
- 日付は**必ず当日**（`date +%F` で確認）。未来日・過去日を書かない。
- URL の末尾スラッシュの有無は既存エントリの流儀に合わせる（ディレクトリ型は末尾 `/`、
  拡張子型は `.html` まで書く）。sitemap と実際の公開URLがずれるとクロールで 404 になる。
- 全URLを送り直したいときだけ、GitHub の Actions → 「IndexNow submit」→ Run workflow →
  `all` にチェックで手動実行（普段は不要）。
