"""
さいたま市 認可保育所等 施設詳細情報スクレイピング（列構造対応版）
---
【使い方】
  python3 facility_scrape.py

【出力】
  facility_info.js  ← index.html が読み込む
"""

import os
import json
import re
import urllib.request
import pdfplumber

BASE = "https://www.city.saitama.lg.jp/kosodate/shiritai/category8/p105054_d/fil/"

# 各PDFの列インデックス定義
# (施設名列, 定員列, 住所列, 電話列, 区列)
FACILITY_PDFS = [
    {
        "file": "r7koutitsuhoikuen.pdf",
        "category": "認可保育所（公立）",
        "cols": {"ward": 0, "name": 1, "cap": 2, "age": 3, "addr": 6, "phone": 7},
    },
    {
        "file": "r7shititsuhoikuen.pdf",
        "category": "認可保育所（私立）",
        "cols": {"ward": 0, "name": 1, "cap": 2, "age": 3, "addr": 5, "phone": 6},
    },
    {
        "file": "r7shoukibo.pdf",
        "category": "小規模保育事業",
        "cols": {"ward": 0, "type": 1, "name": 2, "cap": 3, "age": 4, "addr": 6, "phone": 7},
    },
    {
        "file": "r7jigyousho.pdf",
        "category": "事業所内保育事業",
        "cols": {"ward": 0, "name": 1, "cap": 2, "age": 3, "addr": 5, "phone": 6},
    },
    {
        "file": "r7kateiteki.pdf",
        "category": "家庭的保育事業",
        "cols": {"ward": 0, "name": 1, "cap": 2, "age": 3, "addr": 5, "phone": 6},
    },
    {
        "file": "r7ninteikodomoen.pdf",
        "category": "認定こども園",
        "cols": {"ward": 0, "name": 1, "cap": 2, "age": 3, "addr": 5, "phone": 6},
    },
]

PDF_DIR = "facility_pdfs"

WARD_NAMES = ["西", "北", "大宮", "見沼", "中央", "桜", "浦和", "南", "緑", "岩槻"]

def download_pdfs():
    os.makedirs(PDF_DIR, exist_ok=True)
    for item in FACILITY_PDFS:
        url  = BASE + item["file"]
        dest = os.path.join(PDF_DIR, item["file"])
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
            print(f"  エラー({item['file']}): {e}")


def cell(row, idx):
    """安全にセルの文字列を取得する"""
    if idx is None or idx >= len(row):
        return ""
    v = row[idx]
    return str(v).replace("\n", " ").strip() if v else ""


def normalize_address(addr, ward_str):
    """住所にさいたま市・区名を補完する"""
    if not addr:
        return ""
    if "さいたま市" in addr:
        return addr
    # 区名を補完
    ward_full = ward_str + "区" if ward_str and not ward_str.endswith("区") else ward_str
    if ward_full and not addr.startswith(ward_full):
        return f"さいたま市{ward_full}{addr}"
    return f"さいたま市{addr}"


def normalize_phone(phone):
    """電話番号を 048-XXX-XXXX 形式に整形する"""
    if not phone:
        return ""
    phone = phone.strip()
    # 括弧付き (048)xxx-xxxx → 除去
    phone = re.sub(r"[（(]\s*048\s*[）)]\s*[-－]?", "", phone)
    # すでに 048- で始まっているなら OK
    if phone.startswith("048"):
        return phone
    # 8桁の数字（ハイフン除去後）なら市外局番を付加
    digits = re.sub(r"[-－\s]", "", phone)
    if re.match(r"^\d{7,8}$", digits):
        # ハイフン箇所を復元
        if "-" in phone or "－" in phone:
            return f"048-{phone}"
        else:
            # 数字だけ→ XXX-XXXX で分割
            return f"048-{digits[:3]}-{digits[3:]}"
    return phone


def parse_facility_pdf(pdf_path, category, cols):
    print(f"\n[{category}] 解析中: {pdf_path}")
    facilities = []
    current_ward = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row:
                        continue

                    # ヘッダー行スキップ
                    row_str = " ".join(str(c) for c in row if c)
                    if any(kw in row_str for kw in ["施設名称", "施設名", "電話番号", "定員", "区"]):
                        if "施設名" in row_str:
                            continue

                    # 区名の更新
                    w = cell(row, cols.get("ward"))
                    w_clean = w.replace("区", "").strip()
                    if w_clean in WARD_NAMES:
                        current_ward = w_clean

                    # 施設名を取得
                    name = cell(row, cols.get("name"))
                    if not name or name.isdigit() or len(name) < 2:
                        continue
                    # 区名だけの行はスキップ
                    if name in WARD_NAMES or name.replace("区", "") in WARD_NAMES:
                        continue

                    addr_raw = cell(row, cols.get("addr"))
                    addr = normalize_address(addr_raw, current_ward)
                    phone = normalize_phone(cell(row, cols.get("phone")))
                    cap = cell(row, cols.get("cap"))
                    age = cell(row, cols.get("age"))

                    info = {
                        "name": name,
                        "category": category,
                        "ward": current_ward + "区" if current_ward else "",
                        "address": addr,
                        "phone": phone,
                        "capacity": cap,
                        "age": age,
                    }
                    facilities.append(info)
                    print(f"  {name} / {info['ward']} / {addr[:25]} / {phone}")

    print(f"  合計 {len(facilities)} 件")
    return facilities


def main():
    print("=== さいたま市 施設詳細情報スクレイピング ===\n")

    print("【1】PDFダウンロード")
    download_pdfs()

    print("\n【2】PDF解析")
    all_facilities = []
    for item in FACILITY_PDFS:
        pdf_path = os.path.join(PDF_DIR, item["file"])
        if not os.path.exists(pdf_path):
            print(f"  スキップ（ファイルなし）: {pdf_path}")
            continue
        results = parse_facility_pdf(pdf_path, item["category"], item["cols"])
        all_facilities.extend(results)

    print(f"\n【3】facility_info.js 生成（合計 {len(all_facilities)} 件）")
    js = (
        "// さいたま市 施設詳細情報\n"
        "// 生成日時: " + __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M") + "\n"
        f"const facilityInfo = {json.dumps(all_facilities, ensure_ascii=False, indent=2)};\n"
    )
    with open("facility_info.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("  書き出し完了: facility_info.js")
    print("\n=== 完了 ===")


if __name__ == "__main__":
    main()
