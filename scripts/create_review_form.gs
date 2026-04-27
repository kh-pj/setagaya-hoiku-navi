function createReviewForm() {
  var form = FormApp.create('さいたま保育ナビ｜見学レポート投稿フォーム');
  form.setDescription(
    'さいたま市の保育園・保育施設の見学レポートを投稿してください。\n' +
    '投稿いただいた内容は確認後、さいたま保育ナビに掲載されます。\n\n' +
    '【投稿時のお願い】\n' +
    '・保育士・職員の氏名など個人が特定できる情報は記載しないでください。\n' +
    '・特定の個人への批判・誹謗中傷にあたる内容は掲載できません。\n' +
    '・「先生の対応が丁寧だった」など、施設全体の印象としてお書きください。'
  );
  form.setCollectEmail(false);

  // 見学日
  form.addTextItem()
    .setTitle('見学日（年・月）')
    .setHelpText('例：2026年3月')
    .setRequired(true);

  // 区
  var wardItem = form.addListItem().setTitle('区').setRequired(true);
  wardItem.setChoiceValues(['西区','北区','大宮区','見沼区','中央区','桜区','浦和区','南区','緑区']);

  // 施設名
  form.addTextItem()
    .setTitle('施設名')
    .setHelpText('例：植水保育園（正式名称でご入力ください）')
    .setRequired(true);

  // 月齢
  form.addTextItem()
    .setTitle('見学時のお子さんの月齢')
    .setHelpText('例：8ヶ月　または　2歳')
    .setRequired(true);

  // 総合評価（3段階）
  var ratingItem = form.addListItem().setTitle('総合評価').setRequired(true);
  ratingItem.setChoiceValues(['良い','普通','気になる点あり']);

  // 良かった点
  form.addParagraphTextItem()
    .setTitle('良かった点')
    .setHelpText('先生の雰囲気、環境、保育方針など。個人名は記載しないでください。')
    .setRequired(true);

  // 気になった点
  form.addParagraphTextItem()
    .setTitle('気になった点')
    .setHelpText('任意。施設全体の印象としてお書きください。特定個人への批判はご遠慮ください。')
    .setRequired(false);

  // 投稿者属性
  form.addTextItem()
    .setTitle('投稿者属性')
    .setHelpText('任意。例：0歳児ママ、1歳児パパ（匿名で掲載されます）')
    .setRequired(false);

  // 同意
  var consentItem = form.addCheckboxItem().setTitle('掲載に同意します').setRequired(true);
  consentItem.setChoices([consentItem.createChoice('投稿内容がさいたま保育ナビに掲載されることに同意します')]);

  Logger.log('フォームURL: ' + form.getPublishedUrl());
  Logger.log('編集URL: ' + form.getEditUrl());
}
