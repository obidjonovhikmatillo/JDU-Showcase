# 作業報告書

## 1. 基本情報

| 項目 | 内容 |
|------|------|
| プロジェクト名 | TasteGuide — 多言語レストラン口コミプラットフォーム |
| 報告期間 | 2026 年 3 月 — 2026 年 6 月 |
| 報告者 | （氏名を記入） |
| 所属 | Cowork プロジェクト |

---

## 2. 作業概要

本プロジェクトでは、タシケントを想定したレストラン口コミ Web アプリケーション「TasteGuide」を、Next.js 16 および PostgreSQL を基盤として設計・実装した。4 言語 UI、ユーザー認証、レビュー投稿、管理画面、本番デプロイ準備までを一貫して担当した。

---

## 3. 完了した作業（Work completed）

### 3.1 基盤・設計

- Next.js App Router + TypeScript プロジェクト構成
- Tailwind CSS v4、shadcn/ui による UI 基盤
- Prisma スキーマ設計（6 モデル）とマイグレーション
- シードデータ（12 レストラン、8 カテゴリ、20 レビュー、4 ユーザー）

### 3.2 認証・セキュリティ

- Auth.js（Credentials）+ bcrypt による登録・ログイン
- JWT セッション、ミドルウェアによる `/profile`・`/admin` 保護
- ロールベース権限（USER / ADMIN）
- パスワードハッシュの Prisma 拡張除外

### 3.3 公開機能

- ホーム（カテゴリ、高評価・新着）
- レストラン一覧：検索、カテゴリ／都市／評価／価格（UZS）フィルタ、グリッド／リスト
- 詳細：ギャラリー、評価ショーケース、レビュー一覧、住所表示
- 404、エラーバウンダリ、Open Graph メタデータ、favicon

### 3.4 レビュー・プロフィール

- レビュー CRUD（画像添付、来店日）
- プロフィール閲覧、モーダル編集 UI
- 自分のレビュー一覧（プロフィールページ）

### 3.5 管理機能

- ダッシュボード統計
- レストラン・カテゴリ・レビュー・ユーザーの管理画面
- 公開／非公開、多言語フィールド編集

### 3.6 多言語化

- next-intl による `en` / `uz` / `ru` / `ja`
- URL ロケールプレフィックス、言語スイッチャー
- 全主要画面の翻訳 JSON

### 3.7 画像

- Cloudinary 連携（本番）
- 開発環境ローカル `public/uploads/`
- バリデーション（形式・サイズ・空ファイル）

### 3.8 テスト・品質

- Vitest 15 ケース（全 Pass）
- Playwright E2E 19 ケース定義（一部 Pass）
- テスト仕様書・結果報告書
- TypeScript / ESLint / 本番ビルド成功

### 3.9 デプロイ・ドキュメント

- Vercel + Neon/Supabase 手順（`docs/DEPLOYMENT.md`）
- `.env.example`、本番シードガード
- Cowork 提出用日本語ドキュメント 7 種

---

## 4. 困難だった点（Difficulties）

| # | 困難 | 詳細 |
|---|------|------|
| 1 | **Next.js App Router と i18n** | ミドルウェアで Auth.js と next-intl を同時に扱う必要があり、ルーティング順序の調整に時間を要した |
| 2 | **Server Actions とフォーム** | クライアントハイドレーション前のネイティブフォーム送信が E2E を不安定化 |
| 3 | **画像 URL** | 開発（ローカル）と本番（Cloudinary）の二系統、Next.js Image の remotePatterns 設定 |
| 4 | **E2E 安定性** | クライアントサイドルーターによる URL 更新の非同期性 |
| 5 | **デモ画像** | 外部 Unsplash ID の 404 → `public/images/` へのローカル保存へ切替 |

---

## 5. 解決策（Solutions）

| 困難 | 解決 |
|------|------|
| i18n + 認証 | `middleware.ts` で pathname から locale を strip し、保護後に intlMiddleware を実行 |
| フォーム | `preventDefault` ラッパー、React Hook Form + Server Actions |
| 画像 | `lib/uploads/image-storage.server.ts` で環境分岐、Cloudinary 必須を本番ドキュメント化 |
| E2E | API ログイン補助、単体テストで権限・バリデーションを担保 |
| デモ画像 | `scripts/download-restaurant-images.mjs` で検証済み画像を取得 |

---

## 6. 個人の貢献（Personal contribution）

※ チーム開発の場合は役割分担を記入。単独開発の場合は以下をそのまま使用。

| 領域 | 貢献内容 |
|------|----------|
| 設計 | ER 設計、画面構成、技術選定 |
| 実装 | フロントエンド・バックエンド全般（約 90% 以上のコード） |
| DB | Prisma スキーマ、シード、マイグレーション |
| UI/UX | Airbnb 風デザイン、Inter Tight 字体、UZS 価格、レスポンシブ |
| テスト | Vitest / Playwright 整備、仕様書作成 |
| ドキュメント | 英語・日本語技術文書、デプロイ手順 |

---

## 7. 学んだこと（Lessons learned）

1. **サーバー優先設計** — Server Components と Server Actions を早期に採用することで、データ取得と権限チェックを一箇所に集約できた。
2. **i18n は最初から** — 後付けより、`messages/` 構造と locale ルーティングを初期設計に含める方が効率的だった。
3. **テストピラミッド** — E2E だけに頼らず、権限・バリデーションを Vitest で固めることで品質を維持できた。
4. **本番を見据えた環境分離** — 画像ストレージや DB 接続（プール／直接）を開発初期から doc 化すべきだった。
5. **誠実なテスト報告** — 未 Pass の E2E を隠さず結果報告書に記載することが、大学提出において重要。

---

## 8. 今後の作業（参考）

- Playwright E2E 全ケース Pass
- Leaflet 地図（任意）
- 本番 Vercel への実デプロイと運用監視

---

## 9. 署名

| 項目 | 内容 |
|------|------|
| 報告者 | （記入） |
| 日付 | 2026 年　　月　　日 |

---

*本報告書は実装リポジトリ `cowork-restaurant-reviews` の実態に基づく。*
