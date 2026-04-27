"""
さいたま市 全10区 保育園空き状況 スクレイピング＆パーサー
---
【使い方】
  python scrape.py

【処理の流れ】
  1. 各区のPDFをダウンロード（pdfs/ フォルダに保存）
  2. 各PDFをパースして nursery データを抽出
  3. data.js を生成（全区のデータを含む）
"""

import os
import json
import re
import urllib.request
import pdfplumber

# =============================================
# 全10区 の PDF URL
# =============================================
BASE = "https://www.city.saitama.lg.jp/003/001/015/001/p097822_d/fil/"
WARDS = [
    {"id": "01", "name": "西区",   "file": "01nishi_r8.pdf"},
    {"id": "02", "name": "北区",   "file": "02kita_r8.pdf"},
    {"id": "03", "name": "大宮区", "file": "03omiya_r8.pdf"},
    {"id": "04", "name": "見沼区", "file": "04minuma_r8.pdf"},
    {"id": "05", "name": "中央区", "file": "05chuo_r8.pdf"},
    {"id": "06", "name": "桜区",   "file": "06sakura_r8.pdf"},
    {"id": "07", "name": "浦和区", "file": "07urawa_r8.pdf"},
    {"id": "08", "name": "南区",   "file": "08minami_r8.pdf"},
    {"id": "09", "name": "緑区",   "file": "09midori_r8.pdf"},
    {"id": "10", "name": "岩槻区", "file": "10iwatsuki_r8.pdf"},
]

PDF_DIR = "pdfs"


def download_pdfs():
    """全区のPDFをダウンロードする"""
    os.makedirs(PDF_DIR, exist_ok=True)
    for ward in WARDS:
        url  = BASE + ward["file"]
        dest = os.path.join(PDF_DIR, ward["file"])
        if os.path.exists(dest):
            print(f"  既存: {dest}")
            continue
        print(f"  DL中: {url}")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
                f.write(r.read())
            print(f"  OK : {dest}")
        except Exception as e:
            print(f"  エラー: {ward['name']} – {e}")


def parse_val(val):
    """セル値を数値に変換する"""
    if val is None:
        return 0
    val = str(val).replace("\n", "").strip()
    if val.isdigit():
        return int(val)
    if "○" in val:
        return 1
    if "×" in val or val == "-" or val == "":
        return 0
    m = re.search(r"\d+", val)
    return int(m.group()) if m else 0


def parse_pdf(pdf_path, ward_name):
    """PDFを解析して保育施設リストを返す"""
    print(f"\n[{ward_name}] 解析中: {pdf_path}")
    nurseries = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    # ヘッダー・合計行をスキップ
                    if not row:
                        continue
                    row_text = " ".join(str(c) for c in row if c)
                    if any(kw in row_text for kw in ["施設名", "合計", "保育所コード", "種別"]):
                        continue

                    # 園名の列を探す（インデックス1 or 2）
                    name = None
                    for idx in [2, 1]:
                        if len(row) > idx and row[idx] and str(row[idx]).strip():
                            candidate = str(row[idx]).replace("\n", "").strip()
                            # 数字だけの場合は園名ではない
                            if candidate and not candidate.isdigit():
                                name = candidate
                                break

                    if not name:
                        continue

                    try:
                        nd = {"name": name, "ward": ward_name}

                        if len(row) >= 11:
                            # 認定こども園（列数多め）
                            nd["category"] = "認定こども園"
                            nd["0"] = {"vac": parse_val(row[4])}
                            nd["1"] = {"vac": parse_val(row[5])}
                            nd["2"] = {"vac": parse_val(row[6])}
                            nd["3"] = {"vac": parse_val(row[7])}
                            nd["4"] = {"vac": parse_val(row[8])}
                            nd["5"] = {"vac": parse_val(row[9])}
                        elif len(row) == 10:
                            # 認可保育園（0〜5歳）
                            nd["category"] = "認可保育所"
                            nd["0"] = {"vac": parse_val(row[3])}
                            nd["1"] = {"vac": parse_val(row[4])}
                            nd["2"] = {"vac": parse_val(row[5])}
                            nd["3"] = {"vac": parse_val(row[6])}
                            nd["4"] = {"vac": parse_val(row[7])}
                            nd["5"] = {"vac": parse_val(row[8])}
                        elif len(row) == 8:
                            # 小規模保育事業（0〜2歳）
                            nd["category"] = "小規模保育事業所"
                            nd["0"] = {"vac": parse_val(row[4])}
                            nd["1"] = {"vac": parse_val(row[5])}
                            nd["2"] = {"vac": parse_val(row[6])}
                            nd["3"] = {"vac": None}
                            nd["4"] = {"vac": None}
                            nd["5"] = {"vac": None}
                        elif len(row) == 7:
                            # 家庭的保育事業
                            nd["category"] = "家庭的保育事業"
                            nd["0"] = {"vac": parse_val(row[3])}
                            nd["1"] = {"vac": parse_val(row[4])}
                            nd["2"] = {"vac": parse_val(row[5])}
                            nd["3"] = {"vac": None}
                            nd["4"] = {"vac": None}
                            nd["5"] = {"vac": None}
                        else:
                            print(f"  DEBUG len={len(row)} name={name}")
                            continue

                        nurseries.append(nd)
                        vacs = " / ".join(str(nd[str(a)]["vac"]) for a in range(6))
                        print(f"  追加: {name} [{vacs}]")

                    except Exception as e:
                        print(f"  スキップ: {name} – {e}")
                        continue

    print(f"  合計 {len(nurseries)} 件")
    return nurseries


def clear_pdfs():
    """既存PDFを削除して最新版を再ダウンロードできるようにする"""
    if os.path.exists(PDF_DIR):
        for f in os.listdir(PDF_DIR):
            if f.endswith(".pdf"):
                os.remove(os.path.join(PDF_DIR, f))
                print(f"  削除: {f}")


def main():
    import sys
    print("=== さいたま市 全区 保育園スクレイピング ===\n")

    # --refresh オプションで既存PDFを削除
    if "--refresh" in sys.argv:
        print("【0】既存PDF削除")
        clear_pdfs()

    # ----- Step 1: PDFダウンロード -----
    print("\n【1】PDFダウンロード")
    download_pdfs()

    # ----- Step 2: PDF解析 -----
    print("\n【2】PDF解析")
    all_nurseries = []
    for ward in WARDS:
        pdf_path = os.path.join(PDF_DIR, ward["file"])
        if not os.path.exists(pdf_path):
            print(f"  スキップ（ファイルなし）: {pdf_path}")
            continue
        nurseries = parse_pdf(pdf_path, ward["name"])
        all_nurseries.extend(nurseries)

    # ----- Step 3: data.js 生成 -----
    # ----- Step 3: facility_info.jsとカテゴリ照合 -----
    print(f"\n【3】カテゴリ照合")
    fi_path = "facility_info.js"
    if os.path.exists(fi_path):
        with open(fi_path, "r", encoding="utf-8") as f:
            fi_text = f.read()
        # facilityInfo配列を抽出してパース
        m = re.search(r"const facilityInfo = (\[.*\]);", fi_text, re.DOTALL)
        if m:
            facility_info = json.loads(m.group(1))
            fixes = 0
            for n in all_nurseries:
                fi = None
                for f in facility_info:
                    if f["name"] == n["name"] or f["name"] in n["name"] or n["name"] in f["name"]:
                        fi = f
                        break
                if fi and fi.get("category") and fi["category"] != n["category"]:
                    print(f"  修正: {n['name']} [{n['category']}] → [{fi['category']}]")
                    n["category"] = fi["category"]
                    fixes += 1
            print(f"  カテゴリ修正: {fixes}件")
        else:
            print("  facility_info.js のパースに失敗")
    else:
        print("  facility_info.js が見つかりません（カテゴリ照合スキップ）")

    # ----- Step 4: data.js 生成 -----
    print(f"\n【4】data.js 生成（合計 {len(all_nurseries)} 件）")
    js = (
        "// さいたま市 全区 保育施設空き状況データ\n"
        "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
        f"const authorizedNurseries = {json.dumps(all_nurseries, ensure_ascii=False, indent=2)};\n"
    )
    out_path = "data.js"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"  書き出し完了: {out_path}")
    print("\n=== 完了 ===")


if __name__ == "__main__":
    main()
