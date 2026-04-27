import json
import time
import os
import re
from duckduckgo_search import DDGS

# 読み込み
with open("facility_info.js", "r", encoding="utf-8") as f:
    text = f.read()

# JSONを取り出す
json_str = text.split("const facilityInfo = ", 1)[1].rsplit(";", 1)[0]
facilities = json.loads(json_str)

print(f"全 {len(facilities)} 件のURLを検索します...")

# 検索から除外するドメイン
BANNED_DOMAINS = ["wikipedia.org", "navitime.co.jp", "homemate-research.com", "minkou.jp",
                  "city.saitama", "gaccom.jp", "bing.com", "google.com"]

def is_valid_url(url):
    for bd in BANNED_DOMAINS:
        if bd in url: return False
    return True

# 検索関数
def get_url(ddgs, name, address, ward):
    # 名前に "保育園" などが含まれていない場合は足す
    query = f"さいたま市 {ward} {name}"
    if "保育" not in name and "こども" not in name and "幼稚園" not in name:
        query += " 保育園"

    try:
        results = ddgs.text(query, region='jp-tz', max_results=3)
        for r in results:
            url = r.get('href', '')
            if is_valid_url(url):
                return url
        return ""
    except Exception as e:
        print(f"Error {name}: {e}")
        return ""

ddgs = DDGS()
updated = 0
total = len(facilities)

for i, f in enumerate(facilities):
    if "url" in f and f["url"]:
        continue # 既にある場合はスキップ

    url = get_url(ddgs, f["name"], f.get("address", ""), f.get("ward", ""))
    
    if url:
        f["url"] = url
        updated += 1
        print(f"[{i+1}/{total}] {f['name']} => {url}")
    else:
        print(f"[{i+1}/{total}] {f['name']} => Not Found")
    
    # Ratelimit対策
    time.sleep(1.2)

# バックアップ
import shutil
shutil.copy("facility_info.js", "facility_info_bak.js")

# facility_info.js の上書き
js_out = (
    "// さいたま市 施設詳細情報\n"
    "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
    f"const facilityInfo = {json.dumps(facilities, ensure_ascii=False, indent=2)};\n"
)
with open("facility_info.js", "w", encoding="utf-8") as fw:
    fw.write(js_out)

print(f"\n完了！{updated}件のURLが見つかり、追加されました。")
