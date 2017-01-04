import MailUtil from './libs/Google/MailUtil';
import consts from './Consts';

export default class Slack {
  constructor() {
    this.TAG = 'Slack ';
    Logger.log(`${this.TAG}, constructor`);

    this.consts = consts.getAll();

    this.SHEET_NAME = 'others';

    this.OTHERS_DATE_CELL = 'A1';
    this.OTHERS_DATE_COL = 1;
    this.OTHERS_URL_COL = 2;
    this.OTHERS_IMAGE_COL = 3;

    this.init();
  }

  /**
   * init spreadsheet
   * @param { }
   */
  init() {
    // sheet
    this.sheet = this.consts.SPREADSHEET.getSheetByName(this.SHEET_NAME);
    Logger.log(`${this.TAG}, init() sheet= , ${this.sheet.getName()}`);

    // last row
    this.lastRow = this.sheet.getLastRow();
    Logger.log(`${this.TAG}, init() lastRow= , ${this.lastRow}`);
  }

  start() {
    this.getPeriod();

    const COUNT = 1;
    const URL = 'https://slack.com/api/channels.history?token=' +
      this.consts.SLACK_API_TOKEN + '&channel=' +
      //CHANNEL + "&oldest=" +
      //this.START_TS + "&latest=" +
      //this.END_TS + "&count=" +
      this.consts.SLACK_CHANNEL + '&count=' +
      COUNT + '&unreads=1&pretty=1';
    // const URL = `https://slack.com/api/channels.history?token=,
    //   ${this.consts.SLACK_API_TOKEN}, &channel=,
    //   //CHANNEL + "&oldest=" +
    //   //this.START_TS + "&latest=" +
    //   //this.END_TS + "&count=" +
    //   ${this.consts.SLACK_CHANNEL}, &count=,
    //   ${COUNT}, &unreads=1&pretty=1`;

    Logger.log(URL);

    const response = UrlFetchApp.fetch(URL).getContentText();
    Logger.log(response);

    const responseObj = JSON.parse(response);
    Logger.log(responseObj);

    //get photo data
    let urlString = responseObj.messages[0].text;
    Logger.log(urlString);
    urlString = urlString.replace(/</g, '');
    urlString = urlString.replace(/>/g, '');
    Logger.log(urlString);

    // Get Name to test
    const name = this.sheet.getRange(this.lastRow, this.OTHERS_URL_COL).getValue();
    Logger.log(name);

    if (urlString === name) {
      Logger.log('Exists');
    } else {
      Logger.log('Nothing');
      // When it's not done yet, go!

      this.scrapeImage(this.sheet, this.lastRow + 1, urlString);
      this.setInfoValue(this.sheet, this.lastRow + 1, urlString);
    }
  }

  scrapeImage(sheet, row, url) {
    //let us fetch the details from API. This will give you the details of photos and URL
    const response = UrlFetchApp.fetch(url).getContentText();
    const myRegexp = /display_src": "([\s\S]*?)?ig_cache/i;

    const match = myRegexp.exec(response);
    Logger.log(match);

    const urlString = match[1];
    Logger.log(urlString);

    const stringVal = sheet.getRange(row, this.OTHERS_IMAGE_COL).setValue(urlString);

    // Send Mail
    this.sendMail(urlString);
  }

  setInfoValue(sheet, row, urlString) {
    sheet.getRange(row, this.OTHERS_DATE_COL).setValue(Date.now());
    sheet.getRange(row, this.OTHERS_URL_COL).setValue(urlString);
  }

  getPeriod() {
    // Get Time
    const date = this.sheet.getRange(this.OTHERS_DATE_CELL).getValue();
    Logger.log(date);

    this.START_TS = this.getStartTs(date);
    this.END_TS = this.getEndTs(date);

    Logger.log(`${this.TAG}, this.START_TS= , ${this.START_TS}`);
    Logger.log(`${this.TAG}, this.END_TS= , ${this.END_TS}`);
  }

  getStartTs(val) {
    const startDate = new Date(val);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    const startTS = startDate.getTime() / 1000;
    return startTS;
  }

  getEndTs(val) {
    var endDate = new Date(val);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);
    var endTS = endDate.getTime() / 1000;
    return endTS;
  }

  sendMail(imgPath) {
    const strTo = this.consts.SCRIPT_PROPERTIES.getProperty('mail_to');
    const strSubject = 'You got an Instagram Photo for WOTD';
    const strBody = 'Have a good one!';
    // Get An image
    const image = UrlFetchApp.fetch(imgPath);

    MailUtil.send(strTo, strSubject, strBody, [image.getBlob().setName('wotd.jpg')]);

    // MailApp.sendEmail({
    //   to: strTo,
    //   subject: strSubject,
    //   body: strBody,
    //   attachments: [image.getBlob().setName('wotd.jpg')]
    // });

    // Gmail だと Mail Delivery Subsystem 飛んでくる
    /*
     GmailApp.sendEmail(
     strTo,
     strSubject,
     strBody,
     {
     from: strFrom,
     name: strSender
     }
     ); //MailAppではfromが設定できないとのこと
     */
  }
}

function parse() {
  /*
   // 絵文字のせいかも
   var ranges = [
   '\ud83c[\udf00-\udfff]',
   '\ud83d[\udc00-\ude4f]',
   '\ud83d[\ude80-\udeff]',
   '\ud7c9[\ude00-\udeff]',
   '[\u2600-\u27BF]'
   ];
   var ex = new RegExp(ranges.join('|'), 'g');
   title = title.replace(ex, ''); //ここで削除


   title = title.replace(/(^\s+)|(\s+$)/g, "");

   // preserve newlines, etc - use valid JSON
   title = title.replace(/\\n/g, "\\n")
   .replace(/\\'/g, "\\'")
   .replace(/\\"/g, '\\"')
   .replace(/\\&/g, "\\&")
   .replace(/\\r/g, "\\r")
   .replace(/\\t/g, "\\t")
   .replace(/\\b/g, "\\b")
   .replace(/\\f/g, "\\f");

   // remove non-printable and other non-valid JSON chars
   title = title.replace(/[\u0000-\u0019]+/g,"");

   Logger.log(title);

   // TODO: パースができなくてエラーがおきる

   var responseObj = JSON.parse(title);
   Logger.log(responseObj);
   */

}
