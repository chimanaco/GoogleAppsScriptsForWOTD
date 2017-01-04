import SpreadsheetsUtil from './libs/Google/SpreadsheetsUtil';
import TumblrUtil from './libs/Tumblr/TumblrUtil';

export default class Tumblr {
  constructor() {
    this.TAG = 'Tumblr ';
    Logger.log(this.TAG + "constructor");

    this.SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
    this.SHEET_NAME = this.SCRIPT_PROPERTIES.getProperty("sheet_name");
    this.CONSUMER_KEY = this.SCRIPT_PROPERTIES.getProperty("tumblr_consumer_key");
    this.CONSUMER_SECRET = this.SCRIPT_PROPERTIES.getProperty("tumblr_consumer_secret");

    // Logger.log(this.TAG + "constructor config" + Config.srcDir)
    this.BLOG_POST_URL = "https://api.tumblr.com/v2/blog/washroomoftheday.tumblr.com/post";

    //

    // TODO: Move to Singleton
    this.SOURCE_COL = 4;
    this.DATE_COL = 5;
    this.NAME_COL = 6;
    this.LATITUDE_COL = 7;
    this.LONGITUDE_COL = 8;
    this.ADDRESS_COL = 9;
    this.COUNTRY_COL = 10;
    this.CITY_COL = 11;
    this.TAGS_COL = 12;
    this.DONE_COL = 13;
    this.USER_INSTAGRAM_COL = 14;
    this.FB_GROUP_COL = 15;

    this._init();
  }

  /**
   * write data on the spreadsheet
   * @param { }
   */
  writeData() {
    const firstRow = this._checkIfDone(this.lastRow);
    Logger.log("First Row = " + firstRow);

    if (firstRow != 0) {
      this._goPosts(this.sheet, firstRow, this.lastRow);
    }
  }

  /**
   * init spreadsheet
   * @param { }
   */
  _init() {
    // SpreadSheet
    SpreadsheetsUtil.init();
    this.spreadsheet = SpreadsheetsUtil.getSpreadSheet();
    Logger.log(this.TAG + "init() speradsheet=" + this.spreadsheet);

    // sheet
    this.sheet = this.spreadsheet.getSheetByName(this.SHEET_NAME);
    Logger.log(this.TAG + "init() sheet= " + this.sheet);

    // last row
    this.lastRow = this.sheet.getLastRow();
    Logger.log(this.TAG + "init() lastRow=  " + this.lastRow);
  }

  _checkIfDone(row) {
    let rowToStart = 0;
    Logger.log(this.TAG + "_checkIfDone() row=" + row);

    for (var i = row; i > 0; i--) {
      var isDone = this._checkCell(i);
      if (isDone) {
        rowToStart = i + 1;
        Logger.log("IsDone = " + isDone);
        break;
      }
    }
    return rowToStart;
  }

  /**
   * check if the row is done or not
   * @param { number } row the row to check
   * @return { boolean } isDone
   */
  _checkCell(row) {
    // Get Name value to test
    const cellValue = this.sheet.getRange(row, this.DONE_COL).getValue();
    Logger.log(this.TAG + "_checkCell() cellValue=" + cellValue);

    let isDone = false;
    if (cellValue !== '') {
      isDone = true;
    }
    Logger.log(this.TAG + '_checkCell() isDone= ' + isDone);
    return isDone;
  }

  _goPosts(sheet, firstRow, lastRow) {
    for (let i = firstRow; i < lastRow + 1; i++) {
      Logger.log(this.TAG + '_goPosts() isDone= ' + "Post:" + i);
      this._tumblrPost(sheet, i);
    }
  }

  _tumblrPost(sheet, row) {
    Logger.log(row);

    const service = TumblrUtil.getTumblrService(this.CONSUMER_KEY, this.CONSUMER_SECRET);
    // Logger.log(service);

    const name = sheet.getRange(row, this.NAME_COL).getValue();
    const country = sheet.getRange(row, this.COUNTRY_COL).getValue();
    const city = sheet.getRange(row, this.CITY_COL).getValue();
    let caption = name + "\n" + city + " " + country;
    const source = sheet.getRange(row, this.SOURCE_COL).getValue();
    const tags = sheet.getRange(row, this.TAGS_COL).getValue();

    const from = sheet.getRange(row, this.USER_INSTAGRAM_COL).getValue();
    const via = sheet.getRange(row, this.FB_GROUP_COL).getValue();

    Logger.log('from' + from);
    Logger.log('via' + via);

    if (from != '#N/A') {
      Logger.log('From exists' + from);
      // Add Instagram link text
      caption += this._getInstagramLinkText(from);
    } else if (via != '#N/A') {
      Logger.log('Via Exists' + via);
      // Add FB Group link text
      caption += this._getFBGroupLinkText(via);
    }

    const options =
      {
        "oAuthServiceName": "tumblr",
        "oAuthUseToken": "always",
        "method": "POST",
        "payload": {
          "type": "photo",
          "caption": caption,
          "source": source,
          "tags": tags
        }
      };

    if (service.hasAccess()) {
      const response = service.fetch(this.BLOG_POST_URL, options);
      Logger.log(response);
      this._setDoneNumber(sheet, row);

      var date = sheet.getRange(row, this.DATE_COL).getValue();
      var lat = sheet.getRange(row, this.LATITUDE_COL).getValue();
      var lon = sheet.getRange(row, this.LONGITUDE_COL).getValue();
      var address = sheet.getRange(row, this.ADDRESS_COL).getValue();
      var insta = sheet.getRange(row, this.USER_INSTAGRAM_COL).getValue();

      this._copyCell(date, name, lat, lon, address, country, city, insta);

    } else {
      var authorizationUrl = service.authorize();
      Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
    }
  }

  /*
   * Set Done Number as it's done.
   *
   */
  _setDoneNumber(sheet, row) {
    sheet.getRange(row, this.DONE_COL).setValue(1);
    Logger.log(this.TAG + '_setDoneNumber() row= ' + row);
  }

  _copyCell(date, name, lat, lon, address, country, city, insta) {
    var sheet = this._getWashromSheet();
    var row = sheet.getLastRow() + 1;
    Logger.log(this.TAG + '_setDoneNumber() sheet= ' + sheet);
    Logger.log(this.TAG + '_setDoneNumber() row= ' + row);

    sheet.getRange(row, 2).setValue(date);
    sheet.getRange(row, 3).setValue(name);
    sheet.getRange(row, 4).setValue(lat);
    sheet.getRange(row, 5).setValue(lon);
    sheet.getRange(row, 6).setValue(address);
    sheet.getRange(row, 7).setValue(country);
    sheet.getRange(row, 8).setValue(city);
    sheet.getRange(row, 9).setValue(insta);
    Logger.log('Set Done Number on' + row);
  }

  _getWashromSheet() {
    var sheet = this.spreadsheet.getSheetByName('Washroom');
    Logger.log(sheet);

    return sheet;
  }

  _getInstagramLinkText(from) {
    Logger.log('from=' + from);
    var text = "\n";
    var userName = from.substr(1);
    text += "from ";
    text += '<a href="https://www.instagram.com/' + userName + '/">'
    text += from;
    text += '</a>'
    return text;
  }

  _getFBGroupLinkText(via) {
    Logger.log('Via=' + via);
    var text = "\n";
    text += "via ";
    text += '<a href="https://www.facebook.com/groups/washroom.of.the.day/">'
    text += via;
    text += '</a>'
    return text;
  }
}
