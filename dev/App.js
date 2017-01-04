import SpreadsheetsUtil from './libs/Google/SpreadsheetsUtil';
import Instagram from './Instagram';
import Tumblr from './Tumblr';
import Slack from './Slack';
import consts from './Consts';

let _appInstance = null;
export default class App {
  constructor() {
    this.TAG = 'App ';
    Logger.log(this.TAG + "Constructor");

    if (_appInstance !== null) {
      Logger.log("Do App.getInstance()");
      throw new Error("Do App.getInstance()");
    }

    if (_appInstance === null) {
      Logger.log(this.TAG + "No Instance yet");
      _appInstance = this;

      this.setConstsValues();
    }
  }

  setConstsValues() {
    const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
    // Configuration: Obtain Slack web API token at https://api.slack.com/web

    // SpreadSheet
    SpreadsheetsUtil.init();
    const SPREADSHEET = SpreadsheetsUtil.getSpreadSheet();
    Logger.log(`${this.TAG}, init() speradsheet=, ${SPREADSHEET}`);

    // Slack
    const SLACK_API_TOKEN = SCRIPT_PROPERTIES.getProperty('slack_api_token');
    if (!SLACK_API_TOKEN) {
      throw 'You should set "slack_api_token" property from [File] > [Project properties] > [Script properties]';
    }
    const SLACK_CHANNEL = SCRIPT_PROPERTIES.getProperty("slack_channel");
    Logger.log(this.TAG + "start() CHANNEL=  " + SLACK_CHANNEL);

    // Instagram
    const ACCESS_TOKEN = SCRIPT_PROPERTIES.getProperty("instagram_access_token");


    // コンテナにキーと値をセット
    consts.set('SCRIPT_PROPERTIES', SCRIPT_PROPERTIES);
    consts.set('SPREADSHEET', SPREADSHEET);
    consts.set('SLACK_API_TOKEN', SLACK_API_TOKEN);
    consts.set('SLACK_CHANNEL', SLACK_CHANNEL);
    consts.set('INSTAGRAM_ACCESS_TOKEN', ACCESS_TOKEN);

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
    if (_appInstance === null) {
      Logger.log(this.TAG + "Go to Constructor");
      _appInstance = new App();
    }
    return _appInstance;
  }

  fetchInstagram() {
    Logger.log(this.TAG + "fetch");
    const instagram = new Instagram();
    instagram.writeData();
    Logger.log(this.TAG + "getData done");
  }

  startTumblr() {
    Logger.log(this.TAG + "Tumblr post");
    const tumblr = new Tumblr();
    tumblr.writeData();
    Logger.log(this.TAG + "Tumblr post done");
  }

  startSlack() {
    Logger.log(this.TAG + "startSlack");
    const slack = new Slack();
    slack.start();
    Logger.log(this.TAG + "startSlack done");
  }
};
