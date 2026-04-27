#!/bin/bash
# Google Analytics 4 を全HTMLページに追加するスクリプト
# 使い方: bash scripts/add-ga4.sh G-XXXXXXXXXX

GA_ID="$1"

if [ -z "$GA_ID" ]; then
    echo "Usage: bash scripts/add-ga4.sh G-XXXXXXXXXX"
    echo "  GA_ID: Google Analytics 4 Measurement ID"
    exit 1
fi

GA_SNIPPET="<!-- Google Analytics 4 -->\n<script async src=\"https:\/\/www.googletagmanager.com\/gtag\/js?id=${GA_ID}\"><\/script>\n<script>\nwindow.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${GA_ID}');\n<\/script>"

count=0
for file in *.html; do
    if grep -q "googletagmanager.com/gtag" "$file"; then
        echo "SKIP (already has GA): $file"
        continue
    fi
    # Insert after <meta charset="UTF-8">
    sed -i "s/<meta charset=\"UTF-8\">/<meta charset=\"UTF-8\">\n${GA_SNIPPET}/" "$file"
    if [ $? -eq 0 ]; then
        echo "ADDED GA4: $file"
        count=$((count + 1))
    else
        echo "FAILED: $file"
    fi
done

echo ""
echo "Done! GA4 ($GA_ID) added to $count files."
