import MailUtil from './libs/GAS/Google/GASMail';
import consts from './Consts';

export default class Slack {
  constructor(sheet, lastRow) {
    this.TAG = 'Slack ';
    Logger.log(`${this.TAG}, constructor`);

    this.consts = consts.getAll();

    this.sheet = sheet;
    this.lastRow = lastRow;

    this.OTHERS_DATE_CELL = 'A1';
    this.OTHERS_DATE_COL = 1;
    this.OTHERS_URL_COL = 2;
    this.OTHERS_IMAGE_COL = 3;
  }

  /**
   * init spreadsheet
   * @param { }
   */
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
    const endDate = new Date(val);
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
  }
}
