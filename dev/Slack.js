import GASMail from './libs/GAS/Google/GASMail';
import GASSlack from './libs/GAS/Slack/GASSlack';
import GASInstagram from './libs/GAS/Instagram/GASInstagram';
import config from './Config';

export default class Slack {
  constructor() {
    this.TAG = 'Slack ';
    Logger.log(`${this.TAG}, constructor`);
  }

  /**
   * start
   * @param { string } sheet the sheet in use
   * @param { number } lastRow
   */
  start(sheet, lastRow) {
    // this.getPeriod(sheet);

    const urlString = GASSlack.getImageURL(config.slack.apiToken, config.slack.channel);

    // Get Name to test
    const name = sheet.getRange(lastRow, config.columns.others.url).getValue();
    Logger.log(name);

    if (urlString === name) {
      Logger.log('Exists');
    } else {
      Logger.log('Nothing');
      // When it's not done yet, go!

      const imgURLString = GASInstagram.scrapeImage(urlString);
      sheet.getRange(lastRow + 1, config.columns.others.image).setValue(imgURLString);

      this.setInfoValue(sheet, lastRow + 1, urlString);
      // Send Mail
      this.sendMail(imgURLString);
    }
  }

  setInfoValue(sheet, row, urlString) {
    sheet.getRange(row, config.columns.others.date).setValue(Date.now());
    sheet.getRange(row, config.columns.others.url).setValue(urlString);
  }

  /*
   getPeriod(sheet) {
   // Get Time
   const date = sheet.getRange(config.cell.others.date).getValue();
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
