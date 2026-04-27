#!/usr/bin/env python3
"""各区ページに他区へのクロスリンクセクションを追加するスクリプト"""

WARD_INFO = {
    "ward-kita":    {"name": "北区",  "area": "宮原・日進・土呂"},
    "ward-urawa":   {"name": "浦和区", "area": "浦和・北浦和"},
    "ward-omiya":   {"name": "大宮区", "area": "大宮駅周辺"},
    "ward-minami":  {"name": "南区",  "area": "南浦和・武蔵浦和"},
    "ward-nishi":   {"name": "西区",  "area": "指扇・西大宮"},
    "ward-chuo":    {"name": "中央区", "area": "与野・新都心"},
    "ward-iwatsuki":{"name": "岩槻区", "area": "岩槻駅周辺"},
    "ward-midori":  {"name": "緑区",  "area": "浦和美園・東浦和"},
    "ward-minuma":  {"name": "見沼区", "area": "東大宮・七里"},
    "ward-sakura":  {"name": "桜区",  "area": "田島・桜"},
}

def build_cross_link_html(current_key):
    items = []
    for key, info in WARD_INFO.items():
        if key == current_key:
            continue
        items.append(
            f'<li style="margin-bottom:8px;">'
            f'<a href="{key}.html" style="color:#2d7cbc; font-size:14px; text-decoration:none; font-weight:500;">'
            f'さいたま市{info["name"]} 保育園 空き状況'
            f'<span style="font-size:11px; color:#888; font-weight:400; margin-left:6px;">{info["area"]}</span>'
            f'</a></li>'
        )
    items_html = "\n        ".join(items)
    return f"""
        <div style="margin-top: 32px; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e7ea;">
            <h2 style="color: #2c3e50; font-size: 15px; font-weight: 800; margin: 0 0 12px 0;">他の区の保育園 空き状況</h2>
            <ul style="list-style:none; padding:0; margin:0; columns: 2; column-gap: 8px;">
        {items_html}
            </ul>
        </div>
"""

def process(filepath, ward_key):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "他の区の保育園 空き状況" in content:
        print(f"  SKIP: {filepath}")
        return

    cross_html = build_cross_link_html(ward_key)
    marker = "        <div style=\"margin-top: 40px; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e7ea;\">\n    <h2 style=\"color: #2c3e50; font-size: 18px; font-weight: 800; margin-bottom: 16px;\">あわせて読みたい</h2>"
    if marker not in content:
        print(f"  ERROR: marker not found in {filepath}")
        return

    content = content.replace(marker, cross_html + "\n" + marker)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  OK: {filepath}")

if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for key in WARD_INFO:
        filepath = os.path.join(base_dir, f"{key}.html")
        if os.path.exists(filepath):
            process(filepath, key)
        else:
            print(f"  NOT FOUND: {filepath}")
