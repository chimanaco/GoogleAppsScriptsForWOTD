import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import Instagram from './Instagram';
import Tumblr from './Tumblr';
import Slack from './Slack';
import consts from './Consts';

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

      this.setConstsValues();
    }
  }

  setConstsValues() {
    const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
    const SPREADSHEET_ID = SCRIPT_PROPERTIES.getProperty('spreadsheet_id');

    // SpreadSheet
    this.SPREADSHEET = GASSpreadsheets.getSpreadSheetById(SPREADSHEET_ID);
    Logger.log(`${this.TAG}, setConstsValues() speradsheet=, ${this.SPREADSHEET}`);

    // Slack
    // Configuration: Obtain Slack web API token at https://api.slack.com/web
    const SLACK_API_TOKEN = SCRIPT_PROPERTIES.getProperty('slack_api_token');
    if (!SLACK_API_TOKEN) {
      throw 'You should set "slack_api_token" property from [File] > [Project properties] > [Script properties]';
    }
    const SLACK_CHANNEL = SCRIPT_PROPERTIES.getProperty('slack_channel');
    Logger.log(`${this.TAG}, setConstsValues() CHANNEL=, ${SLACK_CHANNEL}`);

    // Instagram
    const ACCESS_TOKEN = SCRIPT_PROPERTIES.getProperty('instagram_access_token');
    const TUMBLR_CONSUMER_KEY = SCRIPT_PROPERTIES.getProperty('tumblr_consumer_key');
    const TUMBLR_CONSUMER_SECRET = SCRIPT_PROPERTIES.getProperty('tumblr_consumer_secret');
    const TUMBLR_POST_URL = 'https://api.tumblr.com/v2/blog/washroomoftheday.tumblr.com/post';

    // コンテナにキーと値をセット
    consts.set('SCRIPT_PROPERTIES', SCRIPT_PROPERTIES);
    consts.set('SPREADSHEET', this.SPREADSHEET);
    consts.set('SLACK_API_TOKEN', SLACK_API_TOKEN);
    consts.set('SLACK_CHANNEL', SLACK_CHANNEL);
    consts.set('INSTAGRAM_ACCESS_TOKEN', ACCESS_TOKEN);
    consts.set('TUMBLR_CONSUMER_KEY', TUMBLR_CONSUMER_KEY);
    consts.set('TUMBLR_CONSUMER_SECRET', TUMBLR_CONSUMER_SECRET);
    consts.set('TUMBLR_POST_URL', TUMBLR_POST_URL);

    consts.set('ORG_DATE_COL', 1);
    consts.set('URL_COL', 3);
    consts.set('SOURCE_COL', 4);
    consts.set('NEW_DATE_COL', 5);
    consts.set('NAME_COL', 6);
    consts.set('LATITUDE_COL', 7);
    consts.set('LONGITUDE_COL', 8);
    consts.set('ADDRESS_COL', 9);
    consts.set('COUNTRY_COL', 10);
    consts.set('CITY_COL', 11);
    consts.set('TAGS_COL', 12);
    consts.set('DONE_COL', 13);
    consts.set('USER_INSTAGRAM_COL', 14);
    consts.set('FB_GROUP_COL', 15);
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

    const sheet = GASSpreadsheets.getSheetByName(this.SPREADSHEET, 'Instagram');
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const instagram = new Instagram(sheet, lastRow);
    instagram.writeData();
    Logger.log(`${this.TAG}, writeDataFromInstagramInfo() done`);
  }

  postToTumblr() {
    Logger.log(`${this.TAG}, postToTumblr()`);
    const sheet = GASSpreadsheets.getSheetByName(this.SPREADSHEET, 'Instagram');
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const tumblr = new Tumblr(sheet, lastRow);
    tumblr.writeData();
    Logger.log(`${this.TAG}, postToTumblr() done`);
  }

  scrapeInstagramImageViaSlack() {
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack()`);
    const sheet = GASSpreadsheets.getSheetByName(this.SPREADSHEET, 'others');
    const lastRow = GASSpreadsheets.getLastRow(sheet);

    const slack = new Slack(sheet, lastRow);
    slack.start();
    Logger.log(`${this.TAG}, scrapeInstagramImageViaSlack() done`);
  }
};
