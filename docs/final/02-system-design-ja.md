# 設計書

| 項目 | 内容 |
|------|------|
| システム名 | Taomchi（`cowork-restaurant-reviews`） |
| 作成日 | 2026 年 6 月 |
| 本番 URL | https://taomchi-restaurant-review.vercel.app |

---

## 1. システム概要

Taomchi は、Next.js 16 App Router 上で動作するフルスタック Web アプリケーションである。ブラウザから HTTPS でアクセスし、React Server Components と Server Actions を通じて PostgreSQL データベースと連携する。

---

## 2. アーキテクチャ

### 2.1 論理構成

```
[ ブラウザ ]
    │ HTTPS
    ▼
[ Vercel — Next.js 16 App Router ]
    ├── Middleware（Auth.js + next-intl ルーティング）
    ├── App Router（/[locale]/...）
    │     ├── Server Components（ページ・データ取得）
    │     ├── Client Components（フォーム・インタラクション）
    │     └── API Routes（/api/auth, /api/uploads）
    └── Server Actions（認証・CRUD・レビュー・管理）
            │
            ├── PostgreSQL on Neon（Prisma ORM）
            └── Vercel Blob（本番画像ストレージ）
```

### 2.2 レイヤー責務

| レイヤー | 責務 | 主要ファイル |
|----------|------|-------------|
| Presentation | React コンポーネント、shadcn/ui、Tailwind CSS v4 | `components/`, `app/[locale]/` |
| Application | Server Actions、データ取得モジュール | `lib/actions/`, `lib/data/` |
| Domain | 権限チェック、バリデーション（Zod）、ビジネスルール | `lib/auth/`, `lib/reviews/` |
| Infrastructure | Prisma ORM、Vercel Blob、ローカル uploads | `lib/prisma.ts`, `lib/uploads/` |

### 2.3 レンダリング方針

| 区分 | 方針 |
|------|------|
| 公開ページ | Server Components 中心（SSR）、SEO・初回表示最適化 |
| フォーム | React Hook Form + Zod + Server Actions |
| セッション | Auth.js JWT、`AuthSessionProvider` でクライアント共有 |
| 認証保護 | Middleware（エッジ）+ サーバーガード（二重チェック） |

---

## 3. 技術スタック

| 区分 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js（App Router） | 16.2.9 |
| 言語 | TypeScript | ^5 |
| UI ライブラリ | React | 19.2.4 |
| スタイル | Tailwind CSS | ^4 |
| UI コンポーネント | shadcn/ui、@base-ui/react | ^4.11.0、^1.6.0 |
| アイコン | lucide-react | ^1.21.0 |
| i18n | next-intl | ^4.13.0 |
| データベース | PostgreSQL（Neon ホスト） | 14+ |
| ORM | Prisma | ^6.19.3 |
| 認証 | Auth.js（next-auth v5 beta） | ^5.0.0-beta.31 |
| パスワードハッシュ | bcryptjs | ^3.0.3（コスト 12） |
| フォームバリデーション | React Hook Form + Zod | ^7.80.0、^4.4.3 |
| 画像ストレージ（本番） | Vercel Blob | ^2.4.1 |
| 画像ストレージ（開発） | ローカル `public/uploads/` | — |
| トースト通知 | Sonner | ^2.0.7 |
| テーマ | next-themes | ^0.4.6 |
| 単体テスト | Vitest | ^4.1.9 |
| E2E テスト | Playwright | ^1.61.0 |
| Lint / フォーマット | ESLint 9、Prettier | ^9、^3.8.4 |
| ホスティング | Vercel | — |

---

## 4. ページ構成

ロケールプレフィックス `{locale}` ∈ `en` | `uz` | `ru` | `ja`。

| パス | 説明 | 認証要件 |
|------|------|---------|
| `/{locale}` | ホーム | 不要 |
| `/{locale}/restaurants` | 一覧・検索・フィルタ | 不要 |
| `/{locale}/restaurants/[slug]` | 詳細・ギャラリー・レビュー | 不要（投稿は要ログイン） |
| `/{locale}/login` | ログイン | 不要（未ログイン時のみ） |
| `/{locale}/register` | 新規登録 | 不要（未ログイン時のみ） |
| `/{locale}/profile` | プロフィール・レビュー履歴 | 要ログイン |
| `/{locale}/admin` | 管理ダッシュボード | ADMIN ロール |
| `/{locale}/admin/restaurants` | 店舗一覧・管理 | ADMIN ロール |
| `/{locale}/admin/restaurants/new` | 店舗作成 | ADMIN ロール |
| `/{locale}/admin/restaurants/[slug]/edit` | 店舗編集・画像 | ADMIN ロール |
| `/{locale}/admin/categories` | カテゴリ管理 | ADMIN ロール |
| `/{locale}/admin/reviews` | レビュー管理 | ADMIN ロール |
| `/{locale}/admin/users` | ユーザー管理 | ADMIN ロール |
| `/api/auth/[...nextauth]` | Auth.js エンドポイント | — |
| `/api/uploads` （POST/DELETE） | 画像アップロード・削除 | 要ログイン |

共通 UI：レスポンシブヘッダー（検索・言語切替・モバイルナビ）、フッター（カテゴリリンク）。

---

## 5. データベース設計

### 5.1 ER 図

```
User ──< Review >── Restaurant ──< Category
              │            │
        ReviewImage   RestaurantImage
```

### 5.2 モデル定義

#### User（テーブル: users）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String（cuid） | 主キー |
| fullName | String | 表示名 |
| email | String | 一意 |
| passwordHash | String | bcrypt ハッシュ（通常クエリから除外） |
| role | Enum USER / ADMIN | ロール、デフォルト USER |
| preferredLanguage | Enum UZ/EN/RU/JA | UI 言語設定、デフォルト EN |
| avatarUrl | String? | プロフィール画像 URL（Vercel Blob） |
| profileHeadline | String? | 自己紹介・職業（最大 80 文字） |
| isActive | Boolean | アカウント有効フラグ、デフォルト true |
| createdAt, updatedAt | DateTime | 自動設定 |

#### Category（テーブル: categories）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String（cuid） | 主キー |
| nameUz, nameEn, nameRu, nameJa | String | 多言語カテゴリ名 |
| slug | String | 一意、URL フィルタ用 |

#### Restaurant（テーブル: restaurants）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String（cuid） | 主キー |
| name, slug | String | 店名・一意 slug |
| descriptionUz/En/Ru/Ja | Text | 多言語説明 |
| address, city | String | 住所 |
| phone, website, openingHours | String? | 任意情報 |
| latitude, longitude | Float | 座標（保存済み、地図 UI は未実装） |
| mainImageUrl, mainImagePublicId | String? | メイン画像（Vercel Blob） |
| priceLevel | Int? | 1〜4（価格帯） |
| cuisineType | String? | 料理ジャンル |
| isPublished | Boolean | 公開フラグ、デフォルト false |
| categoryId | FK → Category | カテゴリ（Restrict 削除） |

#### RestaurantImage（テーブル: restaurant_images）

ギャラリー画像。`restaurantId` FK → Restaurant（Cascade 削除）。

#### Review（テーブル: reviews）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String（cuid） | 主キー |
| userId | FK → User | 投稿者（Cascade 削除） |
| restaurantId | FK → Restaurant | 対象店舗（Cascade 削除） |
| rating | Int | 1〜5（アプリ側検証） |
| title, content | String | タイトル・本文 |
| visitDate | DateTime? | 来店日 |

#### ReviewImage（テーブル: review_images）

レビュー添付画像。`reviewId` FK → Review（Cascade 削除）。

### 5.3 削除規則

| 操作 | 影響 |
|------|------|
| Restaurant 削除 | RestaurantImage・Review・ReviewImage を Cascade 削除 |
| Review 削除 | ReviewImage を Cascade 削除 |
| User 削除 | Review（および ReviewImage）を Cascade 削除 |
| Category 削除 | 参照中の Restaurant がある場合 **Restrict**（エラー） |

### 5.4 マイグレーション

| ファイル名 | 内容 |
|-----------|------|
| `20260608100000_init` | 初期スキーマ（全テーブル） |
| `20260608120000_add_cloudinary_public_ids` | `publicId` フィールド追加（現在は Vercel Blob の公開 ID に使用） |
| `20260608180000_add_profile_headline` | `profileHeadline` フィールド追加 |

---

## 6. 認証フロー

```
1. ユーザーが /login でメール + パスワードを送信
2. Zod で入力バリデーション（loginSchema）
3. メールを小文字化して DB 検索（lib/prisma-auth.ts、passwordHash 含む）
4. isActive チェック → false の場合は拒否
5. bcrypt.compare でパスワード照合
6. 成功時：JWT 生成（id, role, email, fullName, avatarUrl, preferredLanguage 含む）
7. Auth.js が HTTP-only Cookie にセッションを保存
8. プロフィール更新時：unstable_update でトークン内容を即時反映
9. ログアウト時：セッション Cookie を無効化
```

**保護の二重構造：**

| 層 | 実装 | 役割 |
|----|------|------|
| エッジ（Middleware） | `middleware.ts` + `auth.config.ts` | `/profile`・`/admin` への未認証アクセスを高速ブロック |
| サーバー（ページ） | `requireAuth()` / `requireAdmin()` | 認証成功を保証し、不正ロールをリダイレクト |
| Server Actions | `requireAdminAction()` | 管理操作の全ての変更を再検証 |

---

## 7. 画像アップロード設計

| 項目 | 内容 |
|------|------|
| エンドポイント | `POST /api/uploads`、`DELETE /api/uploads` |
| 認証 | 必須（セッション確認） |
| フォルダ権限 | `review`・`avatar`：全ログインユーザー / `restaurantMain`・`restaurantGallery`：ADMIN のみ |
| バリデーション | JPEG / PNG / WebP のみ、最大 5 MB、空ファイル拒否 |
| 本番ストレージ | Vercel Blob（OIDC 自動認証対応） |
| 開発ストレージ | `public/uploads/` へのローカル保存 |

---

## 8. 多言語化設計

| 項目 | 内容 |
|------|------|
| ライブラリ | next-intl 4.x |
| 対応言語 | EN / UZ / RU / JA |
| URL 構造 | `/{locale}/path`（例：`/ja/restaurants`） |
| 翻訳ファイル | `messages/{en,uz,ru,ja}.json` |
| 言語切替 | ヘッダー内ドロップダウン、Cookie + URL でセッション保持 |
| Restaurant / Category | DB にフィールドごとの多言語テキストを格納（`nameEn`, `nameJa` 等） |

---

## 9. セキュリティ対策

| 項目 | 実装内容 |
|------|---------|
| パスワード保護 | bcrypt ハッシュ（コスト 12）、passwordHash は通常 Prisma クライアントから除外 |
| セッション | Auth.js JWT、`AUTH_SECRET` による署名 |
| CSRF | Auth.js / Next.js 標準プロテクション |
| 入力検証 | Zod スキーマ（クライアント + サーバー両側） |
| SQL 注入対策 | Prisma パラメータ化クエリ |
| 権限昇格防止 | 全 Server Action で `userId`・`role` を再検証 |
| 秘密情報管理 | `.env` を `.gitignore` 除外、Vercel 環境変数で管理 |
| 本番シード保護 | `ALLOW_PRODUCTION_SEED=true` フラグなしでシードスクリプトを拒否 |
| 自己無効化防止 | 管理者が自身のアカウントを無効化・降格できないようサーバー側でブロック |

---

## 10. 外部サービス

| サービス | 用途 | 必須 |
|----------|------|------|
| Neon PostgreSQL | データ永続化（本番） | 必須 |
| Vercel Blob | 本番画像ストレージ | アップロード機能に必須 |
| Vercel | ホスティング・デプロイ | 本番環境 |

**未採用：**
- Cloudinary — 当初検討したが、ウズベキスタン国内でサービスが利用できないため Vercel Blob に変更。
- Leaflet / OpenStreetMap — 地図 UI は未実装（住所テキストで代替）。

---

## 11. 環境変数

| 変数 | 用途 |
|------|------|
| `DATABASE_URL` | Prisma 接続（Neon プールド URL） |
| `DIRECT_URL` | Prisma マイグレーション用直接接続 |
| `AUTH_SECRET` | Auth.js JWT 署名シークレット |
| `AUTH_URL` | 正規 HTTPS URL（例：`https://taomchi-restaurant-review.vercel.app`） |
| `NEXT_PUBLIC_APP_URL` | `AUTH_URL` と同値（クライアント公開） |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 読み書きトークン（OIDC 未使用時） |

詳細は `.env.example` および `docs/DEPLOYMENT.md` を参照。

---

## 12. ディレクトリ構成

```
web-app/
├── app/
│   ├── [locale]/          # ページ（ロケール別）
│   │   ├── page.tsx       # ホーム
│   │   ├── restaurants/   # 一覧・詳細
│   │   ├── profile/       # プロフィール（認証保護）
│   │   ├── login/         # ログイン
│   │   ├── register/      # 新規登録
│   │   └── admin/         # 管理画面（ADMIN 保護）
│   ├── api/
│   │   ├── auth/          # Auth.js ハンドラ
│   │   └── uploads/       # 画像アップロード API
│   └── layout.tsx         # ルートレイアウト
├── components/            # 共有 UI コンポーネント
├── lib/
│   ├── actions/           # Server Actions
│   ├── data/              # サーバー側データ取得
│   ├── auth/              # ガード・権限・セッション更新
│   ├── restaurants/       # 検索・フィルタロジック
│   ├── reviews/           # レビュー権限・シリアライズ
│   └── uploads/           # 画像ストレージ抽象化
├── messages/              # 翻訳 JSON（en / uz / ru / ja）
├── prisma/                # スキーマ・マイグレーション・シード
├── tests/                 # Vitest / Playwright テスト
├── docs/                  # プロジェクト文書
└── scripts/               # ユーティリティスクリプト
```

---

*本設計書は 2026 年 6 月時点の実装 `cowork-restaurant-reviews` および `docs/project-audit.md` に基づく。*
