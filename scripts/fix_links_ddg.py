import json
import time
from duckduckgo_search import DDGS

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
    "townpage.goo.ne.jp", "hotpepper", "retty", "z-kids", "bizmo", "saitama-hoiku.or.jp", "navitime", "hoikuen-mayonez",
    "hoikutaikai", "saitamacity-shokuiku", "rbomiya", "cs-delight", "kosodate.city.saitama.jp", "woman.excite.co.jp",
    "saitama.mypl.net"
]

def is_valid_url(url):
    url = url.lower()
    for b in BANNED:
        if b in url:
            return False
    return True

def do_fix():
    print("Loading facility_info.js...")
    with open("facility_info.js", "r", encoding="utf-8") as f:
        text = f.read()

    json_str = text.split("const facilityInfo = ", 1)[1].rsplit(";", 1)[0]
    facilities = json.loads(json_str)

    # First clear invalid ones
    invalid_count = 0
    for f in facilities:
        if "url" in f and f["url"] and not is_valid_url(f["url"]):
            f["url"] = ""
            invalid_count += 1
            
    print(f"Cleared {invalid_count} invalid URLs.")

    count = 0
    ddgs = DDGS()
    
    for f in facilities:
        # Only fetch if there is no URL (either empty or just cleaned out)
        if not f.get("url"):
            name = f['name']
            ward = f.get('ward', '')
            address = f.get('address', '')
            phone = f.get('phone', '')
            
            # Use name, address and phone to get a highly accurate result
            query = f"さいたま市 {name} {address} {phone} 公式"
            
            print(f"Searching for {name} ({count+1})...")
            try:
                results = list(ddgs.text(query, region='jp-jp', safesearch='off', max_results=5))
                found = False
                for r in results:
                    url = r['href']
                    if is_valid_url(url):
                        f["url"] = url
                        print(f"  -> FOUND: {url}")
                        found = True
                        break
                if not found:
                    print(f"  -> NOT FOUND or all banned.")
            except Exception as e:
                print(f"  -> DDG Search Error: {e}")
            
            count += 1
            if count % 10 == 0:
                print("Sleeping for 2 seconds...")
            time.sleep(1)

    js_out = (
        "// さいたま市 施設詳細情報\n"
        "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
        f"const facilityInfo = {json.dumps(facilities, ensure_ascii=False, indent=2)};\n"
    )
    with open("facility_info.js", "w", encoding="utf-8") as fw:
        fw.write(js_out)
    print(f"Done fetching {count} valid URLs via DuckDuckGo!")

if __name__ == "__main__":
    do_fix()
