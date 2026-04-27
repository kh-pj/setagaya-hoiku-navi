import json
import time
import shutil
from playwright.sync_api import sync_playwright
import urllib.parse

def is_valid_url(url):
    url = url.lower()
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
        "townpage.goo.ne.jp"
    ]
    for b in BANNED:
        if b in url:
            return False
    return True

def main():
    print("公式ホームページURLをPlaywright経由で取得します...")
    shutil.copy("facility_info.js", "facility_info_bak.js")
    with open("facility_info.js", "r", encoding="utf-8") as f:
        text = f.read()

    json_str = text.split("const facilityInfo = ", 1)[1].rsplit(";", 1)[0]
    facilities = json.loads(json_str)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Yahoo検索を自動化
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        total = len(facilities)
        updated = 0
        
        for i, f in enumerate(facilities):
            # 既存のURLがまとめサイトや禁止リストに該当する場合はクリアする
            if f.get("url"):
                if not is_valid_url(f["url"]):
                    print(f"[{i+1}/{total}] {f['name']} の無効なURLをクリア: {f['url']}")
                    f["url"] = ""
                else:
                    # さらに、既存URLも内容をチェックして誤りならクリア（今回は実行省略で次回検索へ）
                    continue

            # 園名によっては「保育」などを補完
            name = f['name']
            query = f"さいたま市 {f.get('ward','')} {name}"
            if "保育" not in name and "こども" not in name and "幼稚園" not in name:
                query += " 保育園"

            search_url = f"https://search.yahoo.co.jp/search?p={urllib.parse.quote(query)}"
            
            try:
                page.goto(search_url, wait_until="domcontentloaded", timeout=15000)
                
                # Yahoo Japan検索結果のリンクを取得
                # クラス名ではなくhref属性を含むすべてのaタグでフォールバック
                links = page.evaluate('''() => {
                    const anchors = Array.from(document.querySelectorAll('a'));
                    return anchors.map(a => a.href).filter(href => href && href.startsWith("http"));
                }''')
                
                valid_link = ""
                phone = f.get('phone', '')
                phone_no_hyphen = phone.replace('-', '')
                
                for link in links:
                    if is_valid_url(link):
                        # リンク先にアクセスして内容検証（電話番号と「さいたま市」）
                        try:
                            #  वेरिफिकेशन用のタブ
                            v_page = context.new_page()
                            v_page.goto(link, wait_until="domcontentloaded", timeout=5000)
                            html = v_page.content()
                            v_page.close()
                            
                            # さいたま市、または電話番号が含まれていれば公式と判断
                            if ("さいたま市" in html) or (phone and phone in html) or (phone_no_hyphen and phone_no_hyphen in html):
                                valid_link = link
                                break
                            else:
                                print(f"  -> 内容不一致(他県の可能性大): {link}")
                        except Exception as e:
                            # エラー時は安全のためスキップ
                            pass
                
                if valid_link:
                    f["url"] = valid_link
                    updated += 1
                
                print(f"[{i+1}/{total}] {name} => {valid_link}")
            
            except Exception as e:
                print(f"[{i+1}/{total}] {name} => Error {e}")
            
            # 定期的に保存
            if (i+1) % 20 == 0:
                js_out = (
                    "// さいたま市 施設詳細情報\n"
                    "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
                    f"const facilityInfo = {json.dumps(facilities, ensure_ascii=False, indent=2)};\n"
                )
                with open("facility_info.js", "w", encoding="utf-8") as fw:
                    fw.write(js_out)
                    
            time.sleep(2.0) # Robot扱い回避のために2秒待機

        # 最終保存
        js_out = (
            "// さいたま市 施設詳細情報\n"
            "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
            f"const facilityInfo = {json.dumps(facilities, ensure_ascii=False, indent=2)};\n"
        )
        with open("facility_info.js", "w", encoding="utf-8") as fw:
            fw.write(js_out)

        browser.close()
        print(f"\n完了！新たに{updated}件のURLが見つかり、追加されました。")

if __name__ == "__main__":
    main()
