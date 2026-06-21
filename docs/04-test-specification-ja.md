# テスト仕様書

## 1. 文書情報

| 項目 | 内容 |
|------|------|
| システム名 | TasteGuide（`cowork-restaurant-reviews`） |
| 版数 | 1.0 |
| 作成日 | 2026 年 6 月 |
| 関連文書 | `docs/test-specification.md`（英語版） |

---

## 2. テスト目的

本システムが要件どおり動作することを、自動テストおよび手動確認で検証する。特に認証、権限、レストラン discovery、レビュー CRUD、管理機能、多言語、画像バリデーションを対象とする。

---

## 3. テスト環境

| 項目 | 内容 |
|------|------|
| OS | Windows 10/11、macOS、Linux |
| Node.js | 20 以上（開発環境 24 で検証） |
| DB | PostgreSQL（ローカルまたは embedded） |
| ブラウザ（E2E） | Chromium（Playwright 既定） |
| デフォルトロケール | `en` |

### 3.1 シードアカウント

| ロール | メール | パスワード |
|--------|--------|------------|
| ADMIN | admin@example.com | Admin123! |
| USER | user@example.com | User123! |
| USER | aziza@example.com | User123! |
| USER | kenji@example.com | User123! |

シード実行：`npm run db:seed`

---

## 4. テスト手法

| 種別 | ツール | 対象 |
|------|--------|------|
| 単体テスト | Vitest | ユーティリティ、権限、画像検証 |
| コンポーネントテスト | React Testing Library | レイアウト挙動（T019, T020） |
| E2E テスト | Playwright | 認証、一覧、レビュー、管理 |
| 手動テスト | ブラウザ | E2E 未安定項目の確認 |
| 静的解析 | TypeScript、ESLint | 型・Lint |
| ビルドテスト | `next build` | 本番ビルド |

---

## 5. テストケース一覧

### 5.1 機能テスト（E2E / 手動）

| ID | 機能 | 前提条件 | 手順 | 期待結果 |
|----|------|----------|------|----------|
| T001 | ユーザー登録 | ゲスト、登録ページ | 1. `/en/register` を開く 2. 氏名・メール・パスワード・確認・言語を入力 3. 送信 | `/en/profile` へ遷移しアカウント名が表示される |
| T002 | ログイン | シードユーザー | 1. `/en/login` 2. 有効な認証情報 3. 送信 | プロフィール画面が表示される |
| T003 | ログアウト | ログイン済 | 1. サインアウト 2. `/en/profile` に直接アクセス | ログインへリダイレクト |
| T004 | プロフィール保護 | ゲスト | `/en/profile` に直接アクセス | `/en/login` へ callback 付きリダイレクト |
| T005 | 管理画面保護 | ゲスト・USER・ADMIN | 1. 各ロールで `/en/admin` | ゲスト→ログイン、USER→拒否、ADMIN→ダッシュボード |
| T006 | 言語切替 | ゲスト、レストラン一覧 | 言語スイッチャーでウズベク語選択 | URL が `/uz/...` になる |
| T007 | レストラン検索 | シードデータ | `/en/restaurants` で「Trattoria」検索 | Trattoria Amici が表示、URL に `q=` |
| T008 | フィルタ | カテゴリあり | european-cuisine を選択 | URL に category、該当店舗表示 |
| T009 | 詳細表示 | slug `trattoria-amici` | 詳細 URL を開く | 店名・都市が表示 |
| T010 | レビュー作成 | ログイン済 | 詳細でフォーム送信 | 一覧に新規レビュー |
| T011 | レビュー編集 | 自分のレビュー | 編集ダイアログで保存 | タイトル更新反映 |
| T012 | レビュー削除 | ログイン済 | 削除確認 | 一覧から消える |
| T013 | 他人レビュー操作禁止 | aziza@example.com | 他人のレビュー行 | 編集・削除 UI 非表示 |
| T014 | 管理：店舗作成 | ADMIN | `/admin/restaurants/new` | 編集ページへ遷移 |
| T015 | 管理：店舗編集 | ADMIN | 名称変更・保存 | 更新後名称表示 |
| T016 | 管理：店舗削除 | ADMIN | 一覧から削除 | 一覧から除外 |
| T019 | 地図フォールバック | 公開店舗 | 詳細 DOM 確認 | 住所テキストあり、map iframe なし |
| T020 | モバイルナビ | 390×844 | ホーム表示 | モバイル用 UI、デスクトップ nav 非表示 |

### 5.2 単体・コンポーネントテスト（Vitest）

| ID | 対象 | ファイル | 期待結果 |
|----|------|----------|----------|
| T005（部分） | 管理権限 | `tests/unit/permissions.test.ts` | ADMIN のみ管理可、自己無効化禁止 |
| T013（部分） | レビュー権限 | 同上 | 本人・ADMIN のみ編集可 |
| T017 | 画像検証 | `tests/unit/validate-image-file.test.ts` | PNG 可、5MB 超・PDF・空ファイル不可 |
| T018 | 平均評価 | `tests/unit/compute-average-rating.test.ts` | 空→null、平均計算正しい |
| T019 | 住所表示 | `tests/components/layout-behavior.test.tsx` | 住所テキスト、map 埋め込みなし |
| T020 | レスポンシブ | 同上 | `hidden md:flex` 等のクラス |

---

## 6. 非機能テスト

| 項目 | 方法 | 基準 |
|------|------|------|
| 型安全 | `npm run typecheck` | エラー 0 |
| Lint | `npm run lint` | エラー 0 |
| 本番ビルド | `npm run build` | 成功 |
| セキュリティ | コードレビュー | passwordHash 非露出、Server Action 再検証 |
| i18n | 4 ロケール手動 | 主要画面が翻訳キーで表示 |

---

## 7. テスト実行コマンド

```bash
npm run db:seed          # 前提データ
npm run dev              # 開発サーバー（E2E 用）
npm run test:unit        # Vitest
npm run test:e2e         # Playwright
npm run typecheck
npm run lint
npm run build
```

---

## 8. 合格基準

- 単体テスト：全ケース Pass
- E2E：クリティカルパス（T004, T005, T009, T019, T020）Pass。その他は既知課題として結果報告書に記載
- 本番ビルド：成功

---

## 9. 既知のスコープ外

- Leaflet 地図表示（T019 はテキストフォールバックで代替）
- 決済・予約 API
- 負荷試験・ペネトレーションテスト（本フェーズ対象外）

---

*英語版詳細：`docs/test-specification.md`*
