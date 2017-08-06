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
    const length = config.instagram.history;
    const lastRow = GASSpreadsheets.getLastRow(sheet);
    const instagram = new Instagram();

    for (let i = 0; i < length; i++) {
      instagram.writeData(sheet, lastRow - i);
      Logger.log(`${this.TAG} writeDataFromInstagramInfo() loop ${i}`);
    }
    Logger.log(`${this.TAG}, writeDataFromInstagramInfo() done`);
  }

  writeDataFromInstagramInfoRecover() {
    Logger.log(`${this.TAG}, writeDataFromInstagramInfoRecover()`);

    const sheet = config.spreadSheet.sheet.instagram;
    const length = config.instagram.history;
    const lastRow = GASSpreadsheets.getLastRow(sheet);
    const instagram = new Instagram();
    const row = 7;
    instagram.writeDataHelp(sheet, row);
    Logger.log(`${this.TAG}, writeDataFromInstagramInfoRecover() done`);
  }

  postToTumblr() {
    Logger.log(`${this.TAG}, postToTumblr()`);
    const sheet = config.spreadSheet.sheet.instagram;
    Logger.log(`${this.TAG}, postToTumblr() sheet=, ${sheet.getName()}`);
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const tumblr = new Tumblr();
    tumblr.writeData(sheet, lastRow);
    Logger.log(`${this.TAG}, postToTumblr() done`);
  }

  editTumblrPost() {
    Logger.log(`${this.TAG}, editTumblrPost()`);
    const tumblr = new Tumblr();
    tumblr.editTumblrPost();
  }


  scrapeInstagramImageViaSlack() {
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack()`);
    const sheet = config.spreadSheet.sheet.others;
    const slack = new Slack();

    // const lastRow = GASSpreadsheets.getLastRow(sheet);
    slack.scrapeInstagramImage(sheet);
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack() done`);
  }

  scrapeInstagramName() {
    const sheet = config.spreadSheet.sheet.instagram;
    // Logger.log(`${this.TAG}, postToTumblr() sheet=, ${sheet.getName()}`);
    const instagram = new Instagram();

    // Logger.log(`${this.TAG}, scrapeInstagramName() LOOOOOOOOOP=, ${sheet}, ${i}`);
    let string = GASSpreadsheets.getValueFromCell(sheet, 6, 3);
    Logger.log(`${this.TAG}, scrapeInstagramName() string=, ${string}`);
    let id = instagram.scrapeName(string);
    Logger.log(`${this.TAG}, scrapeInstagramName() id=, ${id}`);

    // string = GASSpreadsheets.getValueFromCell(sheet, 10, 3);
    // Logger.log(`${this.TAG}, scrapeInstagramName() string=, ${string}`);
    // id = instagram.scrapeName(string);
    // Logger.log(`${this.TAG}, scrapeInstagramName() id=, ${id}`);


    // for (let i = 9; i < 11; i++) {
    //   Logger.log(`${this.TAG}, scrapeInstagramName() LOOOOOOOOOP=, ${sheet}, ${i}`);
    //   const string = GASSpreadsheets.getValueFromCell(sheet, i, 3);
    //   Logger.log(`${this.TAG}, scrapeInstagramName() string=, ${string}`);
    //   const id = instagram.scrapeName(string);
    //   Logger.log(`${this.TAG}, scrapeInstagramName() id=, ${id}`);
    // }
  }

  writeAdressFromLatLon() {
    Logger.log(`${this.TAG}, writeAdressFromLatLon()1`);
    const sheet = config.spreadSheet.sheet.instagram;
    const instagram = new Instagram();
    for (let i = 31; i < 35; i++) {
      instagram.writeLocationFromCell(sheet, i);
    }
    Logger.log(`${this.TAG}, writeAdressFromLatLon() done`);
  }
};
