import StringUtil from './libs/util/StringUtil';
import GASUrl from './libs/GAS/Google/GASUrl';
import GASMail from './libs/GAS/Google/GASMail';
import GASSlack from './libs/GAS/Slack/GASSlack';
import GASInstagram from './libs/GAS/Instagram/GASInstagram';
import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import config from './Config';

export default class Slack {
  constructor() {
    this.TAG = 'Slack ';
    Logger.log(`${this.TAG}, constructor`);
  }

  /**
   * start
   * @param { Sheet } sheet the sheet in use
   */
  start(sheet) {
    const length = config.slack.history;
    const url = GASSlack.getImageURL(config.slack.apiToken, config.slack.channel, length);
    const responseObj = GASUrl.getResponseObject(url);

    for (let i = length - 1; i > -1; i--) {
      const lastRow = GASSpreadsheets.getLastRow(sheet);
      const newUrl = StringUtil.removeAngleBrackets(responseObj.messages[i].text);
      const boo = this.checkIfPostedAlready(sheet, lastRow, newUrl, length);

      if (boo) {
        Logger.log(`${this.TAG}, start() Exists`);
      } else {
        Logger.log(`${this.TAG}, start() Nothing`);
        // When it's not done yet, go!
        this.writeSlackInfo(sheet, lastRow, newUrl);
        // TODO: メール連続して打てないみたいなんだけど break してもだめ?
        break;
      }
    }
  }

  /**
   * write slack info
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   * @param { String } urlString
   */
  writeSlackInfo(sheet, row, urlString) {
    Logger.log(`${this.TAG}, writeSlackInfo()`);

    const imgURLString = GASInstagram.scrapeImage(urlString);
    sheet.getRange(row + 1, config.columns.others.image).setValue(imgURLString);

    this.setInfoValue(sheet, row + 1, urlString);
    // Send Mail
    this.sendMail(imgURLString);
  }

  /**
   * write data on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   * @param { String } urlString
   */
  setInfoValue(sheet, row, urlString) {
    Logger.log(`${this.TAG}, setInfoValue() urlString=(), ${urlString}`);
    sheet.getRange(row, config.columns.others.date).setValue(Date.now());
    sheet.getRange(row, config.columns.others.url).setValue(urlString);
  }

  /**
   * check if posted already
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   * @param { String } urlString
   * @param { number } length
   * @return { boolean } bool
   */
  checkIfPostedAlready(sheet, row, urlString, length) {
    Logger.log(`${this.TAG}, checkIfPostedAlready()`);
    let bool = false;
    for (let i = 0; i < length; i++) {
      const boo = this.checkIfPostedOnRow(sheet, row - i, urlString);
      if (boo) {
        bool = true;
        break;
      }
    }
    return bool;
  }

  /**
   * check if posted on Row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   * @param { String } urlString
   * @return { boolean } bool
   */
  checkIfPostedOnRow(sheet, row, urlString) {
    Logger.log(`${this.TAG}, checkIfPostedOnRow()`);
    const name = sheet.getRange(row, config.columns.others.url).getValue();
    let bool = false;
    if (urlString === name) {
      bool = true;
    }
    return bool;
  }

  /**
   * Send Mail
   * @param { String } imgPath
   */
  sendMail(imgPath) {
    // Get An image
    const image = UrlFetchApp.fetch(imgPath);

    GASMail.send(
      config.mail.to,
      config.mail.subject,
      config.mail.body,
      [image.getBlob().setName(config.mail.imgName)]
    );
  }
}
