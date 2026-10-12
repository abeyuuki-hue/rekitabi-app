# タスク名: 「歴たび - 全国パワースポットめぐり」Next.js & LINE LIFF 完全自動構築

## 1. 概要・要件
本プロジェクトは、全国7地域（49社寺霊場）および5大テーマ別スタンプラリーコースを収録した
`power_spots_japan-v2.json` を基盤とする、スマホ最適化・和風モダンWeb/LIFFアプリケーションです。

### 主要技術スタック
- Framework: Next.js 14+ (App Router, TypeScript)
- Styling: Tailwind CSS (和風カラーパレット・明朝体・朱色基調)
- Map: Leaflet.js + Leaflet MarkerCluster (国土地理院 淡色地図タイル + 和風セピアフィルター)
- Platform: LINE LIFF (v2), Vercel
- State / Storage: React Hooks, LocalStorage (オフライン/ブラウザ永続化)

---

## 2. 自動セットアップ・実行スクリプト (`setup.sh`)

以下のシェルスクリプトを実行し、プロジェクトディレクトリの作成から依存パッケージのインストールまでを自動完遂してください。

```bash
#!/usr/bin/env bash
set -e

PROJECT_NAME="rekitabi-app"

echo "=== 1. Next.js プロジェクト生成 ==="
npx --yes create-next-app@latest $PROJECT_NAME \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --use-npm \
  --import-alias="@/*"

cd $PROJECT_NAME

echo "=== 2. 依存ライブラリのインストール ==="
npm install @line/liff leaflet leaflet.markercluster
npm install -D @types/leaflet @types/leaflet.markercluster

echo "=== 3. ディレクトリ構造の作成 ==="
mkdir -p public/data
mkdir -p types
mkdir -p components
mkdir -p app/api/spots

echo "=== セットアップ完了 ==="