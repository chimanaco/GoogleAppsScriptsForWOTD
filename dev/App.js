import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import Instagram from './Instagram';
import Tumblr from './Tumblr';
import Slack from './Slack';
import config from './Config';

let appInstance = null;
export default class App {
  constructor() {
    this.TAG = 'App ';
    Logger.log(`${this.TAG}, constructor`);

    if (appInstance !== null) {
      Logger.log('Do App.getInstance()');
      throw new Error('Do App.getInstance()');
    }

    if (appInstance === null) {
      Logger.log(`${this.TAG}, No Instance yet`);
      appInstance = this;
    }
  }

  static getInstance() {
    if (appInstance === null) {
      Logger.log(`${this.TAG}, Go to Constructor`);
      appInstance = new App();
    }
    return appInstance;
  }

  writeDataFromInstagramInfo() {
    Logger.log(`${this.TAG}, writeDataFromInstagramInfo()`);

    const sheet = config.spreadSheet.sheet.instagram;
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const instagram = new Instagram(sheet, lastRow);
    instagram.writeData();
    Logger.log(`${this.TAG}, writeDataFromInstagramInfo() done`);
  }

  postToTumblr() {
    Logger.log(`${this.TAG}, postToTumblr()`);
    const sheet = config.spreadSheet.sheet.instagram;
    Logger.log(`${this.TAG}, postToTumblr() 10000sheet=, ${sheet.getName()}`);
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const tumblr = new Tumblr(sheet, lastRow);
    tumblr.writeData();
    Logger.log(`${this.TAG}, postToTumblr() done`);
  }

  scrapeInstagramImageViaSlack() {
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack()`);
    const sheet = config.spreadSheet.sheet.others;
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const slack = new Slack(sheet, lastRow);
    slack.start();
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack() done`);
  }
};
