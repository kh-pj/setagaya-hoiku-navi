import json
import urllib.parse
from playwright.sync_api import sync_playwright
import time
import re

BANNED = [
    "wikipedia", "navitime", "homemate-research", "minkou", "hoikushibank",
    "city.saitama", "gaccom", "bing.com", "google.com", "yahoo.co.jp", "yahoo-net.jp",
    "hoikuen-mayonez", "hoikumap", "gourmet", "map.yahoo", "maps.google",
    "hoikue", "saitamacity-kosodate.jp", "hoicil.com", "amatias.com", "ensagaso.com",
    "stanby.com", "youtube.com", "hoiku-jyouhou", "benesse", "job-medley", "en-gage",
    "hoikushi", "mamastar.jp", "ekiten.jp", "facebook.com", "instagram.com", "twitter.com",
    "lycorp.co.jp", "privacypolicy", "privacy-policy", "lycbiz.com", "yahoo-ads", "kidsna.com",
    "minpo.or.jp", "tokyominkan.jp", "hoiku-box.net", "hoikukyuujin.com", "enmikke.jp", "hoiku.pref.saitama.lg.jp",
    "mhlw.go.jp", "sumai-surfin.com", "saitama-support.jp", "asoten.jp", "a-l-i-n-e.jp", "kyoto-fukukyo.jp", "icofuku.org",
    "base-japan.jp", "mapfan.com", "hoiku-shigoto.com", "hoiku-is.jp", "wam.go.jp", "note.com",
    "openhouse-group.com", "saitama-tsunagu.com", "saitama-fudousan.co.jp", "music.kawai.jp",
    "post.japanpost.jp", "hoiku-collection.jp", "the0123child.com", "machimachi.com", "rubese.net",
    "townpage.goo.ne.jp", "hotpepper", "retty", "z-kids", "bizmo", "saitama-hoiku.or.jp", "navitime", "hoikuen-mayonez"
]

def is_valid_url(url):
    url = url.lower()
    for b in BANNED:
        if b in url:
            return False
    return True

with open("facility_info.js", "r", encoding="utf-8") as f:
    text = f.read()

json_str = text.split("const facilityInfo = ", 1)[1].rsplit(";", 1)[0]
facilities = json.loads(json_str)

invalid_indices = []
for i, f in enumerate(facilities):
    url = f.get("url", "")
    if url and not is_valid_url(url):
        invalid_indices.append((i, f))
    elif not url:
        pass
        # invalid_indices.append((i, f)) # Wait, I don't want to re-run for ones previously missed unless needed, but let's just do it.
        invalid_indices.append((i, f))

print(f"Total facilities: {len(facilities)}, Invalid/Missing URLs: {len(invalid_indices)}")

if len(invalid_indices) > 0:
    print("Fetching URLs for invalid/missing ones...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()

        for idx, f in invalid_indices:
            name = f['name']
            query = f"さいたま市 {f.get('ward','')} {name} 公式"
            if "保育" not in name and "こども" not in name and "幼稚園" not in name:
                query += " 保育園"

            search_url = f"https://search.yahoo.co.jp/search?p={urllib.parse.quote(query)}"
            valid_link = ""
            print(f"Searching for {name}... ", end="")
            
            try:
                page.goto(search_url, wait_until="domcontentloaded", timeout=10000)
                links = page.evaluate('''() => {
                    const anchors = Array.from(document.querySelectorAll('a'));
                    return anchors.map(a => a.href).filter(href => href && href.startsWith("http"));
                }''')
                
                phone = f.get('phone', '')
                phone_no_hyphen = phone.replace('-', '')
                
                for link in links:
                    if is_valid_url(link):
                        try:
                            v_page = context.new_page()
                            v_page.goto(link, wait_until="domcontentloaded", timeout=5000)
                            html = v_page.content()
                            v_page.close()
                            if ("さいたま市" in html) or (phone and phone in html) or (phone_no_hyphen and phone_no_hyphen in html):
                                valid_link = link
                                break
                        except Exception as e:
                            pass
            except Exception as e:
                print(f"Error: {e}")
            
            if valid_link:
                facilities[idx]["url"] = valid_link
                print(f"FOUND: {valid_link}")
            else:
                facilities[idx]["url"] = ""
                print(f"NOT FOUND")
                
            time.sleep(1.0)

        browser.close()

    js_out = (
        "// さいたま市 施設詳細情報\n"
        "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
        f"const facilityInfo = {json.dumps(facilities, ensure_ascii=False, indent=2)};\n"
    )
    with open("facility_info.js", "w", encoding="utf-8") as fw:
        fw.write(js_out)
    print("File facility_info.js updated.")
