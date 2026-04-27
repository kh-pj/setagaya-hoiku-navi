/**
 * 世田谷保育ナビ 見学レポート自動公開スクリプト
 *
 * 使い方:
 * 1. スプレッドシートのツール > Apps Script で貼り付け
 * 2. スクリプトプロパティに GITHUB_TOKEN を設定
 * 3. K列（承認）にチェックを入れて publishApproved を実行
 */

const SPREADSHEET_ID  = "1GU2V0cOaftielOg0pb8ePWwknH7LtpFWKUHKYBrddGw";
const GITHUB_REPO     = "kh-pj/setagaya-hoiku-navi";
const GITHUB_FILE     = "reviews.json";
const GITHUB_BRANCH   = "main";

// 列インデックス（0始まり）
// A:タイムスタンプ B:見学日 C:区 D:施設名 E:月齢 F:総合評価
// G:良かった点 H:気になった点 I:投稿者属性 J:掲載同意 K:承認
const COL = {
  TIMESTAMP:     0,
  VISIT_DATE:    1,
  WARD:          2,
  FACILITY_NAME: 3,
  CHILD_AGE:     4,
  RATING:        5,
  GOOD_POINTS:   6,
  CONCERN:       7,
  AUTHOR_TYPE:   8,
  CONSENT:       9,
  APPROVED:      10,
};

function publishApproved() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  const rows  = sheet.getDataRange().getValues();
  const reviews = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[COL.APPROVED]) continue;
    if (!row[COL.CONSENT])  continue;

    reviews.push({
      id:            i,
      visit_date:    row[COL.VISIT_DATE] ? String(row[COL.VISIT_DATE]).substring(0, 7) : "",
      ward:          row[COL.WARD],
      facility_name: row[COL.FACILITY_NAME],
      child_age:     row[COL.CHILD_AGE],
      rating:        row[COL.RATING],
      good_points:   row[COL.GOOD_POINTS],
      concern:       row[COL.CONCERN] || "",
      author_type:   row[COL.AUTHOR_TYPE] || "",
      created_at:    row[COL.TIMESTAMP] ? new Date(row[COL.TIMESTAMP]).toISOString() : "",
    });
  }

  pushToGitHub(JSON.stringify(reviews, null, 2));
  SpreadsheetApp.getUi().alert(`✅ ${reviews.length}件を公開しました`);
}

function pushToGitHub(content) {
  const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  if (!token) throw new Error("GITHUB_TOKEN がスクリプトプロパティに未設定");

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  let sha = null;
  const getResp = UrlFetchApp.fetch(apiUrl, { headers, muteHttpExceptions: true });
  if (getResp.getResponseCode() === 200) {
    sha = JSON.parse(getResp.getContentText()).sha;
  }

  const body = {
    message: `レビューデータを更新 (${new Date().toLocaleString("ja-JP")})`,
    content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
    branch:  GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const resp = UrlFetchApp.fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });

  if (resp.getResponseCode() >= 400) {
    throw new Error(`GitHub API エラー: ${resp.getContentText()}`);
  }
}

function onFormSubmit(e) {
  const adminEmail = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL");
  if (!adminEmail) return;

  const facilityName = e.values[COL.FACILITY_NAME];
  GmailApp.sendEmail(
    adminEmail,
    `【保育ナビ】新しい見学レポート：${facilityName}`,
    `新しい見学レポートが届きました。\n\n施設名: ${facilityName}\n\nスプレッドシートのK列に✓を入れてpublishApprovedを実行してください。`
  );
}
