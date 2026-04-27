#!/bin/bash
# 画像を WebP に一括変換（max 1200px幅、quality 82）
# PNG/JPG の元ファイルは保持（削除は別コマンド）

set -e
IMG_DIR="$(cd "$(dirname "$0")/.." && pwd)/images"
MAX_WIDTH=1200
QUALITY=82
TMP=$(mktemp -d)
trap "rm -rf $TMP" EXIT

converted=0
skipped=0
total_before=0
total_after=0

echo "変換対象: $IMG_DIR"
echo "設定: max ${MAX_WIDTH}px, quality ${QUALITY}"
echo "---"

for f in "$IMG_DIR"/*.png "$IMG_DIR"/*.jpg "$IMG_DIR"/*.jpeg; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  base="${f%.*}"
  webp="${base}.webp"

  # アイコン類はスキップ
  case "$name" in
    favicon*|apple-touch*|og-*)
      echo "SKIP (icon):     $name"
      ((skipped++))
      continue
      ;;
  esac

  # 既にwebpがあるならスキップ
  if [ -f "$webp" ]; then
    echo "SKIP (exists):   $name"
    ((skipped++))
    continue
  fi

  size_before=$(stat -f%z "$f")
  total_before=$((total_before + size_before))

  # 幅取得
  width=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')

  if [ -n "$width" ] && [ "$width" -gt "$MAX_WIDTH" ]; then
    # リサイズ付き変換
    sips -Z $MAX_WIDTH "$f" --out "$TMP/resize_$name" >/dev/null 2>&1
    cwebp -q $QUALITY -quiet "$TMP/resize_$name" -o "$webp"
  else
    cwebp -q $QUALITY -quiet "$f" -o "$webp"
  fi

  size_after=$(stat -f%z "$webp")
  total_after=$((total_after + size_after))
  reduction=$((100 - (size_after * 100 / size_before)))

  printf "%-35s  %8d KB  →  %6d KB  (-%d%%)\n" \
    "$name" $((size_before/1024)) $((size_after/1024)) "$reduction"
  ((converted++))
done

echo "---"
echo "変換:    $converted 件"
echo "スキップ: $skipped 件"
if [ $total_before -gt 0 ]; then
  total_reduction=$((100 - (total_after * 100 / total_before)))
  echo "合計:    $((total_before/1024/1024)) MB → $((total_after/1024/1024)) MB  (-${total_reduction}%)"
fi
