# 設計書

## 1. システム概要

TasteGuide は、Next.js App Router 上で動作するフルスタック Web アプリケーションである。ブラウザから HTTPS でアクセスし、サーバーコンポーネントと Server Actions 経由で PostgreSQL と連携する。

---

## 2. アーキテクチャ

### 2.1 論理構成

```
[ ブラウザ ]
    │ HTTPS
    ▼
[ Vercel — Next.js 16 ]
    ├── Middleware（Auth.js + next-intl）
    ├── App Router（/[locale]/...）
    ├── API Routes（/api/auth, /api/uploads）
    └── Server Actions（認証・CRUD・レビュー）
            │
            ├── PostgreSQL（Prisma ORM）
            └── Cloudinary（本番画像、任意）
```

### 2.2 レイヤー

| レイヤー | 責務 |
|----------|------|
| Presentation | React コンポーネント、shadcn/ui、Tailwind CSS v4 |
| Application | Server Actions、データ取得モジュール（`lib/data/*`） |
| Domain | 権限（`lib/auth/*`）、バリデーション（Zod）、ビジネスルール |
| Infrastructure | Prisma、Cloudinary、ローカルファイルストレージ |

### 2.3 レンダリング方針

- 公開ページ：Server Components 中心、必要箇所のみ Client Components
- フォーム：React Hook Form + Zod、Server Actions へ FormData 送信
- 認証セッション：Auth.js JWT、`AuthSessionProvider` でクライアント共有

---

## 3. 技術スタック

| 区分 | 技術 | バージョン目安 |
|------|------|----------------|
| フレームワーク | Next.js（App Router） | 16.x |
| 言語 | TypeScript | 5.x |
| UI | React | 19.x |
| スタイル | Tailwind CSS | v4 |
| コンポーネント | shadcn/ui、Base UI | — |
| i18n | next-intl | 4.x |
| DB | PostgreSQL | 14+ |
| ORM | Prisma | 6.x |
| 認証 | Auth.js（next-auth v5 beta） | Credentials |
| パスワード | bcryptjs | — |
| フォーム | React Hook Form + Zod | — |
| 画像 | Cloudinary / ローカル uploads | — |
| テスト | Vitest、RTL、Playwright | — |
| デプロイ | Vercel | — |

---

## 4. ページ構成

ロケールプレフィックス `{locale}` ∈ `en` | `uz` | `ru` | `ja`。

| パス | 説明 | 認証 |
|------|------|------|
| `/{locale}` | ホーム | 不要 |
| `/{locale}/restaurants` | 一覧・検索・フィルタ | 不要 |
| `/{locale}/restaurants/[slug]` | 詳細・レビュー | 不要（投稿は要ログイン） |
| `/{locale}/login` | ログイン | 不要 |
| `/{locale}/register` | 新規登録 | 不要 |
| `/{locale}/profile` | プロフィール・自分のレビュー | 要ログイン |
| `/{locale}/admin` | 管理ダッシュボード | ADMIN |
| `/{locale}/admin/restaurants` | 店舗一覧 | ADMIN |
| `/{locale}/admin/restaurants/new` | 店舗作成 | ADMIN |
| `/{locale}/admin/restaurants/[slug]/edit` | 店舗編集 | ADMIN |
| `/{locale}/admin/categories` | カテゴリ管理 | ADMIN |
| `/{locale}/admin/reviews` | レビュー管理 | ADMIN |
| `/{locale}/admin/users` | ユーザー管理 | ADMIN |
| `/api/auth/[...nextauth]` | Auth.js エンドポイント | — |
| `/api/uploads` | 画像アップロード API | 要ログイン |

共通 UI：ヘッダー（検索バー、言語切替、モバイルナビ）、フッター。

---

## 5. データベースモデル

### 5.1 ER 概要

```
User ──< Review >── Restaurant >── Category
              │            │
              │            ├──< RestaurantImage
              └──< ReviewImage
```

### 5.2 モデル定義

#### User（users）

| フィールド | 型 | 説明 |
|------------|-----|------|
| id | String (cuid) | PK |
| fullName | String | 表示名 |
| email | String | 一意 |
| passwordHash | String | bcrypt ハッシュ（通常クエリから除外） |
| role | Enum USER / ADMIN | ロール |
| preferredLanguage | Enum UZ/EN/RU/JA | UI 言語 |
| avatarUrl | String? | プロフィール画像 URL |
| isActive | Boolean | 有効フラグ |

#### Category（categories）

| フィールド | 型 | 説明 |
|------------|-----|------|
| nameUz, nameEn, nameRu, nameJa | String | 多言語名称 |
| slug | String | 一意、URL フィルタ用 |

#### Restaurant（restaurants）

| フィールド | 型 | 説明 |
|------------|-----|------|
| name, slug | String | 店名・一意 slug |
| descriptionUz/En/Ru/Ja | Text | 多言語説明 |
| address, city | String | 住所 |
| latitude, longitude | Float | 座標（地図未実装だがデータ保持） |
| mainImageUrl, mainImagePublicId | String? | メイン画像 |
| priceLevel | Int? | 1〜4（UZS 換算表示） |
| isPublished | Boolean | 公開フラグ |
| categoryId | FK | Category |

#### RestaurantImage / Review / ReviewImage

- ギャラリー画像、レビュー本体（rating 1〜5、アプリ側検証）、レビュー添付画像。

### 5.3 削除規則

- Restaurant 削除 → 画像・レビュー cascade
- Review 削除 → ReviewImage cascade
- User 削除 → Review cascade
- Category 削除 → Restaurant 参照時 Restrict（ブロック）

### 5.4 マイグレーション

- `prisma/migrations/` に SQL マイグレーションを管理
- 本番：`npm run db:migrate:deploy`（`DIRECT_URL` 使用）

---

## 6. ユーザーロール

| ロール | 権限 |
|--------|------|
| **ゲスト** | 公開店舗の閲覧、登録・ログイン |
| **USER** | プロフィール編集、レビュー CRUD（自分の投稿のみ） |
| **ADMIN** | 上記すべて + 管理画面全機能 |

権限チェック：

- `middleware.ts`：`/profile`、`/admin` ガード
- `lib/auth/permissions.ts`：レビュー・管理操作
- 各 Server Action 内での再検証

---

## 7. 主要ワークフロー

### 7.1 レストラン発見

1. ユーザーが `/restaurants` を開く
2. 検索語・カテゴリ・都市・評価・価格帯をクエリパラメータで指定
3. `lib/restaurants/discovery.ts` が Prisma でフィルタ・ページング
4. カードクリックで詳細へ遷移

### 7.2 レビュー投稿

1. ログインユーザーが詳細ページでフォーム入力
2. `lib/actions/review.ts` が Zod 検証 → DB 保存
3. 画像は `/api/uploads` または Server Action 経由で Cloudinary／ローカルへ
4. 一覧を revalidate して表示更新

### 7.3 管理：店舗公開

1. ADMIN が `/admin/restaurants/new` で作成
2. `isPublished=false` で保存可能
3. 編集画面で画像・多言語フィールドを更新
4. 公開トグルで一般ユーザーに表示

### 7.4 認証

1. 登録：パスワードハッシュ保存 → 自動ログイン → プロフィールへ
2. ログイン：Credentials → JWT セッション
3. ログアウト：セッション破棄

### 7.5 多言語

1. `next-intl` が `/{locale}/` を解析
2. `messages/{locale}.json` を読み込み
3. 言語切替で同一パスの別ロケールへ遷移

---

## 8. セキュリティ

| 項目 | 実装 |
|------|------|
| パスワード | bcrypt（ラウンド 12） |
| セッション | JWT（Auth.js）、`AUTH_SECRET` |
| CSRF | Auth.js / Next.js 標準 |
| 入力検証 | Zod スキーマ（クライアント + サーバー） |
| SQL 注入 | Prisma パラメータ化クエリ |
| 権限昇格 | Server Action で userId・role 再確認 |
| シークレット | `.env` を git 除外、Vercel 環境変数 |
| 本番シード | `ALLOW_PRODUCTION_SEED=true` 無しでは拒否 |
| passwordHash | Prisma 拡張で通常 API から除外 |

---

## 9. 外部サービス

| サービス | 用途 | 必須 |
|----------|------|------|
| PostgreSQL（Neon / Supabase / ローカル） | 永続データ | 必須 |
| Cloudinary | 本番画像 CDN | 本番推奨 |
| Vercel | ホスティング | デプロイ時 |
| Unsplash（シード用ローカル画像） | デモ画像 `public/images/` | 開発・デモ |

**未使用：** Leaflet / OpenStreetMap（地図 UI は未実装）

---

## 10. 環境変数

| 変数 | 用途 |
|------|------|
| `DATABASE_URL` | Prisma 接続（プール） |
| `DIRECT_URL` | マイグレーション用直接接続 |
| `AUTH_SECRET` | Auth.js |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | 絶対 URL |
| `CLOUDINARY_*` | 画像 API |

詳細は `.env.example` および `docs/DEPLOYMENT.md` を参照。

---

## 11. ディレクトリ構成（抜粋）

```
app/[locale]/          # ページ
components/            # UI コンポーネント
lib/
  actions/             # Server Actions
  data/                # サーバー側データ取得
  auth/                # ガード・権限
  restaurants/         # 検索ロジック
messages/              # 翻訳 JSON
prisma/                # スキーマ・シード
tests/                 # Vitest / Playwright
```

---

*本設計書は 2026 年 6 月時点の実装 `cowork-restaurant-reviews` に基づく。*
