#!/bin/bash
# HTML内の画像参照を .webp に書き換える
# ただし favicon / apple-touch / og-default などアイコン系は除外

set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "対象ディレクトリ: $DIR"

# 対象HTMLファイル
files=$(find . -maxdepth 2 -name "*.html" -type f)

# 除外パターン（これらは .webp に変換していないので置換しない）
EXCLUDE='(favicon|apple-touch|og-default)'

count=0
for f in $files; do
  # 一時ファイルに書き出し、変更があれば上書き
  tmp=$(mktemp)

  # images/xxx.png → images/xxx.webp （除外パターン以外）
  # images/xxx.jpg → images/xxx.webp
  # images/xxx.jpeg → images/xxx.webp
  perl -pe '
    s{(images/)([a-zA-Z0-9_\-]+)\.(png|jpg|jpeg)}{
      my ($prefix, $name, $ext) = ($1, $2, $3);
      if ($name =~ /^(favicon|apple-touch|og-default)/) {
        "$prefix$name.$ext"
      } else {
        "$prefix$name.webp"
      }
    }gex
  ' "$f" > "$tmp"

  if ! diff -q "$f" "$tmp" > /dev/null 2>&1; then
    changes=$(diff "$f" "$tmp" | grep -c '^<' || true)
    cp "$tmp" "$f"
    printf "  %-50s  %d箇所更新\n" "$f" "$changes"
    ((count++))
  fi
  rm -f "$tmp"
done

echo "---"
echo "更新ファイル数: $count"
