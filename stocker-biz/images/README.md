# stocker-biz/images/

スクリーンショット・アセット置き場。

## ファイル命名規則

| ファイル名 | 用途 |
|---|---|
| `logo.svg` | ナビ・フッターロゴ（差し替え後に nav の img タグを有効化） |
| `og-image.png` | OGP 画像（1200×630px） |
| `screen-barcode.webp` | 機能紹介①：バーコードスキャン画面（配信用） |
| `screen-order.webp` | 機能紹介②：発注依頼一覧画面（配信用） |
| `screen-users.webp` | 機能紹介③：ユーザー管理画面（配信用） |
| `screen-csv.webp` | 機能紹介④：CSVインポート画面（配信用） |
| `source/*.png` | 上記スクリーンショットの原寸・未圧縮ソース |
| `screen-1.png` ～ `screen-6.png` | スクリーンショットストリップ用（横スクロール） |

## 差し替え手順

### 機能紹介エリア（feature-visual）

`index.html` の各 `feature-visual` div 内にあるコメントを参照。

```html
<!-- 差し替え前（プレースホルダー） -->
<div class="feature-visual">
  <div class="feature-visual-inner">...</div>
</div>

<!-- 差し替え後（実スクショ） -->
<div class="feature-visual">
  <img src="images/screen-barcode.webp" width="1200" height="675" loading="lazy" decoding="async" alt="バーコードスキャン画面">
</div>
```

配信用画像を作り直す場合は、`source`内のPNGを入力にし、横幅1200px・WebP品質78を目安にします。配信用WebPから再圧縮しないでください。

### スクリーンショットストリップ

`<div class="screen-placeholder">` を `<img>` に差し替える：

```html
<!-- 差し替え前 -->
<div class="screen-placeholder">ホーム画面</div>

<!-- 差し替え後 -->
<img src="images/screen-1.png" class="screen-img" alt="ホーム画面">
```

### ロゴ

`nav` 内のコメントアウトされた `<img>` タグを有効化し、テキストロゴ部分を削除：

```html
<!-- logo.svg を配置後、下記を有効化 -->
<img src="/stocker-biz/images/logo.svg" alt="Stocker Biz" height="28">
```
