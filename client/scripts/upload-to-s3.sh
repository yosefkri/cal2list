#!/usr/bin/env bash
set -euo pipefail

if ! command -v aws >/dev/null 2>&1; then
  echo "❌ כלי AWS CLI לא נמצא. התקינו אותו והגדירו הרשאות מתאימות." >&2
  exit 1
fi

if [ -z "${S3_BUCKET:-}" ]; then
  echo "❌ הגדירו את המשתנה S3_BUCKET לפני ההעלאה (לדוגמה: export S3_BUCKET=my-bucket-name)." >&2
  exit 1
fi

echo "🚀 בניית הפרויקט ב־production..."
npm run build

echo "📦 העלאת קבצים ל־S3..."
aws s3 sync dist "s3://${S3_BUCKET}" --delete --cache-control "public,max-age=31536000,immutable" --exclude "index.html"
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" --cache-control "no-cache, no-store, must-revalidate"

echo "✅ ההעלאה הסתיימה בהצלחה!"


