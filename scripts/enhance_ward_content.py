#!/usr/bin/env python3
"""全区ページのward-infoセクションをSEO強化版に置き換えるスクリプト"""

WARD_CONTENT = {
    "ward-kita": {
        "old_h2": "北区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市北区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        北区は宮原・日進・土呂エリアを中心に、認可保育園・小規模保育事業所・認定こども園が点在しています。宮原駅周辺は利便性が高く人気のエリアで競争率がやや高め。一方、日進・土呂エリアには比較的空きが出やすい園もあります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">宮原駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        宮原駅（JR高崎線）周辺は共働きファミリーに人気のエリアです。通勤途中に送迎できる利便性から保育需要が高く、特に1歳児クラスは競争率が上がります。早めの申し込みと複数園への出願が内定のカギです。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">日進駅・土呂駅エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        日進駅・土呂駅周辺は宮原と比べると比較的空きが出やすい傾向があります。小規模保育事業所（0〜2歳対象）も複数あり、0歳からの入園を検討している方にとって選択肢が広いエリアです。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>北区の保活ポイント</strong><br>
        ・宮原駅周辺は1歳児クラスの競争が特に激しい<br>・日進・土呂エリアは比較的空きが出やすい<br>・小規模保育事業所は0〜2歳の受け入れが中心
    </div>
</div>""",
    },
    "ward-urawa": {
        "old_h2": "浦和区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市浦和区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        浦和区は浦和駅・北浦和エリアを中心とした文教地区です。子育てファミリーに人気の高いエリアで、特に1歳児クラスの競争は市内でも屈指の激しさ。浦和駅・北浦和駅周辺の認可保育園はほぼ満員状態が続くため、早めの保活と複数園への申し込みが重要です。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">浦和駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        浦和駅（JR京浜東北線・高崎線・宇都宮線）周辺は交通利便性が非常に高く、保育需要も市内最高水準です。認可保育園は年度始めに定員が埋まりやすく、0歳からの申し込みで内定率が上がります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">北浦和駅エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        北浦和駅周辺にも複数の認可保育園や小規模保育事業所があります。浦和駅より若干競争率が低い傾向がありますが、こちらも早めの行動が必須です。駅から少し離れた場所に比較的余裕のある施設があります。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>浦和区の保活ポイント</strong><br>
        ・1歳児クラスは市内最高水準の激戦区<br>・複数の園へ幅広く申し込むことを強く推奨<br>・0歳から申し込むと内定確率が上がる
    </div>
</div>""",
    },
    "ward-omiya": {
        "old_h2": "大宮区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市大宮区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        大宮区は大宮駅を中心とした交通の要衝です。商業施設が充実しており共働きファミリーに人気。大宮駅周辺の認可保育園は0〜1歳の申し込みが集中しますが、駅から少し離れた地域に比較的余裕のある施設もあります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">大宮駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        大宮駅（JR各線・東武野田線・ニューシャトル）は交通の利便性が高く、通勤途中に送迎できる立地として保育需要が集中します。駅直近の認可保育園は競争率が高いため、早期申し込みが重要です。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">大宮区内の小規模保育・認定こども園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        大宮区内には認可保育所のほか、小規模保育事業所や認定こども園もあります。小規模保育（0〜2歳）は定員が少なめのため空きが出ることがあります。3歳以降の連携施設も確認しておくと安心です。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>大宮区の保活ポイント</strong><br>
        ・大宮駅周辺は0〜1歳の申し込みが集中<br>・駅から離れた施設は比較的入りやすい<br>・小規模保育は0〜2歳が対象、早めに確認を
    </div>
</div>""",
    },
    "ward-minami": {
        "old_h2": "南区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市南区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        南区は南浦和・武蔵浦和・中浦和エリアを中心としたファミリー居住区です。複数路線が乗り入れる武蔵浦和駅周辺は共働き家庭に人気で保育需要が高め。一方、中浦和・西浦和方面には比較的余裕のある施設もあります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">南浦和・武蔵浦和駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        南浦和駅（JR京浜東北線・武蔵野線）・武蔵浦和駅（JR埼京線・武蔵野線）周辺は交通利便性が高く人気エリアです。特に1歳児クラスは申し込みが集中します。0歳からの申し込みで有利になります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">中浦和・別所沼エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        中浦和・別所沼周辺には認可保育園や小規模保育事業所があります。武蔵浦和エリアと比べると競争率がやや低い傾向があります。住居をこのエリアで検討中の方には保活しやすい選択肢になります。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>南区の保活ポイント</strong><br>
        ・武蔵浦和駅周辺は1歳の競争が激しい<br>・中浦和・別所沼エリアは比較的余裕あり<br>・南浦和は武蔵野線利用者にも便利な立地
    </div>
</div>""",
    },
    "ward-nishi": {
        "old_h2": "西区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市西区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        西区は指扇・西大宮エリアを中心とした比較的落ち着いた住宅地です。さいたま市内では保育需要が比較的低く、他の区より入園しやすい傾向があります。自然環境が豊かで、のびのびした保育環境を求める家庭に人気です。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">指扇駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        指扇駅（JR川越線）周辺には認可保育園や小規模保育事業所があります。市街地の保育園と比べると競争率が低く、0〜1歳でも比較的入園しやすい傾向があります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">西大宮駅・大宮西部エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        西大宮駅（JR川越線）周辺や大宮西部エリアにも保育施設があります。新興住宅地として家族が増えているエリアですが、保育施設の数も増えており需給バランスが比較的良好です。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>西区の保活ポイント</strong><br>
        ・市内で比較的入りやすいエリアのひとつ<br>・のびのびした自然環境の保育園が多い<br>・年度途中入園のチャンスも他区より多め
    </div>
</div>""",
    },
    "ward-chuo": {
        "old_h2": "中央区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市中央区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        中央区は与野・北与野・さいたま新都心エリアを含む行政・ビジネスの中心地です。さいたまスーパーアリーナや官公庁が集まるさいたま新都心周辺は共働きファミリーが多く、保育需要が年々高まっています。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">さいたま新都心・北与野駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        さいたま新都心駅・北与野駅（JR京浜東北線・埼京線）周辺は官公庁・企業が集まるエリアです。共働き世帯が多く0〜1歳の申し込みが集中します。早めの申し込みを強くおすすめします。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">与野駅・与野本町駅エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        与野駅・与野本町駅（JR京浜東北線・埼京線）周辺には複数の認可保育園や小規模保育事業所があります。新都心エリアと比べると競争率がやや落ち着いており、複数の選択肢を持てます。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>中央区の保活ポイント</strong><br>
        ・新都心エリアは共働き世帯が多く競争率高め<br>・与野・与野本町は比較的選択肢が多い<br>・0歳からの申し込みで内定率アップ
    </div>
</div>""",
    },
    "ward-minuma": {
        "old_h2": "見沼区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市見沼区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        見沼区は東大宮・七里・大和田・春岡エリアを中心とした広域住宅地です。さいたま市の中では比較的入園しやすいエリアで、緑豊かな環境での保育を求める家庭に適しています。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">東大宮駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        東大宮駅（JR宇都宮線）周辺には認可保育園や小規模保育事業所があります。大宮区と比べると競争率が落ち着いており、0〜1歳でも比較的入園しやすい傾向があります。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">七里・大和田・春岡エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        七里・大和田・春岡エリアには複数の保育施設があり、地域に根ざした保育が行われています。自然環境が豊かで、広い園庭を持つ施設も多いのが特徴です。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>見沼区の保活ポイント</strong><br>
        ・市内でも入りやすいエリアのひとつ<br>・緑豊かな広い園庭の施設が多い<br>・東大宮駅から徒歩圏の園も複数あり
    </div>
</div>""",
    },
    "ward-midori": {
        "old_h2": "緑区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市緑区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        緑区は浦和美園・東浦和・大門エリアを中心とした発展著しい住宅地です。浦和美園は埼玉スタジアム近郊の新興住宅街として子育てファミリーが急増中。新設保育施設も増えており、保育の選択肢が拡大しています。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">浦和美園駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        浦和美園駅（埼玉高速鉄道）周辺は人口増加に合わせて保育施設の整備が進んでいます。新設の認可保育園も多く、他の区と比べると入園しやすい傾向があります。ただし人口増加に伴い競争率が上がってきています。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">東浦和駅・大門エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        東浦和駅（JR武蔵野線）周辺や大門エリアには認可保育園や認定こども園があります。浦和美園ほど新しくないぶん地域に根ざした施設が多く、安定した保育環境が整っています。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>緑区の保活ポイント</strong><br>
        ・浦和美園は新設園が多く選択肢が増加中<br>・人口増加で競争率も上昇傾向に<br>・東浦和・大門は地域密着の安定した施設が多い
    </div>
</div>""",
    },
    "ward-iwatsuki": {
        "old_h2": "岩槻区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市岩槻区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        岩槻区はさいたま市の最北東部に位置する歴史ある城下町です。人形の街としても知られ、落ち着いた住環境が特徴。さいたま市内では保育需要が比較的低く、入園しやすいエリアのひとつです。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">岩槻駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        岩槻駅（東武野田線）周辺には認可保育園や小規模保育事業所があります。市内の他のエリアと比べると競争率が低く、0〜1歳でも比較的余裕をもって入園申し込みができます。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">岩槻インター周辺・慈恩寺エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        岩槻インターチェンジ周辺や慈恩寺エリアにも保育施設が点在しています。自然豊かな環境での保育を希望する家庭や、車通勤で送迎を考えている家庭にも選択肢があります。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>岩槻区の保活ポイント</strong><br>
        ・市内で最も入りやすいエリアのひとつ<br>・年度途中入園のチャンスが最も多い区<br>・東武野田線で大宮・春日部方面へのアクセスも便利
    </div>
</div>""",
    },
    "ward-sakura": {
        "old_h2": "桜区の保活情報",
        "new_section": """<div class="ward-info" style="background: #f8fafc; border: 1px solid #e2e7ea; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="color: #2c3e50; font-size: 20px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #e2e7ea; padding-bottom: 8px;">さいたま市桜区の保育園・保活情報</h2>
    <p style="font-size: 14px; line-height: 1.8; color: #444; margin-bottom: 16px;">
        桜区は田島・桜・中島・神田エリアを含む住宅地です。荒川の氾濫原に広がる自然豊かなエリアで、南区・中央区に隣接しています。保育需要は市内平均程度で、複数の選択肢から選べるエリアです。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">西浦和駅・中浦和駅周辺の保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 12px;">
        西浦和駅（JR武蔵野線）・中浦和駅（JR埼京線）周辺には認可保育園や小規模保育事業所があります。南区・中央区との境界に位置するため、隣接区の施設も含めて広く検討できます。
    </p>
    <h3 style="font-size: 15px; font-weight: 700; color: #2c3e50; margin: 16px 0 8px 0;">田島・桜・神田エリアの保育園</h3>
    <p style="font-size: 13px; line-height: 1.8; color: #555; margin-bottom: 16px;">
        田島・桜・神田エリアには地域に根ざした認可保育園や認定こども園があります。荒川沿いの自然環境を活かした保育が行われており、のびのびした環境での子育てを希望する家庭に人気があります。
    </p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; font-size: 14px; color: #1e40af; line-height: 1.8;">
        <strong>桜区の保活ポイント</strong><br>
        ・市内平均的な競争率で選択肢が確保しやすい<br>・荒川沿いの自然豊かな保育環境が特徴<br>・南区・中央区の施設も視野に入れた広域保活が有効
    </div>
</div>""",
    },
}


def process(filepath, ward_key):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    info = WARD_CONTENT[ward_key]
    old_h2 = info["old_h2"]
    new_section = info["new_section"]

    # ward-infoブロック全体を特定して置換
    import re
    # <div class="ward-info" ...> から </div> までを新しいセクションに置換
    pattern = r'<div class="ward-info"[^>]*>.*?</div>\s*</div>'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f"  ERROR: ward-info block not found in {filepath}")
        return

    old_block = match.group(0)
    # 古い見出しが含まれているか確認
    if old_h2 not in old_block:
        print(f"  ERROR: expected h2 '{old_h2}' not found in {filepath}")
        return

    content = content.replace(old_block, new_section)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  OK: {filepath}")


if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for key in WARD_CONTENT:
        filepath = os.path.join(base_dir, f"{key}.html")
        if os.path.exists(filepath):
            process(filepath, key)
        else:
            print(f"  NOT FOUND: {filepath}")
