import SpreadsheetsUtil from './libs/Google/SpreadsheetsUtil';
import TumblrUtil from './libs/Tumblr/TumblrUtil';
import consts from './Consts';

export default class Tumblr {
  constructor(sheet, lastRow) {
    this.TAG = 'Tumblr ';
    Logger.log(`${this.TAG}, constructor`);
    this.consts = consts.getAll();

    this.sheet = sheet;
    this.lastRow = lastRow;
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

  _checkIfDone(row) {
    let rowToStart = 0;
    Logger.log(this.TAG + "_checkIfDone() row=" + row);

    for (let i = row; i > 0; i--) {
      const isDone = SpreadsheetsUtil.checkIfCellHasValue(this.sheet, i, this.consts.DONE_COL);
      if (isDone) {
        rowToStart = i + 1;
        Logger.log("IsDone = " + isDone);
        break;
      }
    }
    return rowToStart;
  }

  _goPosts(sheet, firstRow, lastRow) {
    for (let i = firstRow; i < lastRow + 1; i++) {
      Logger.log(this.TAG + '_goPosts() isDone= ' + "Post:" + i);
      this._tumblrPost(sheet, i);
    }
  }

  _tumblrPost(sheet, row) {
    Logger.log(row);

    const service = TumblrUtil.getTumblrService(this.consts.CONSUMER_KEY, this.consts.CONSUMER_SECRET);
    // Logger.log(service);

    const name = sheet.getRange(row, this.consts.NAME_COL).getValue();
    const country = sheet.getRange(row, this.consts.COUNTRY_COL).getValue();
    const city = sheet.getRange(row, this.consts.CITY_COL).getValue();
    let caption = name + "\n" + city + " " + country;
    const source = sheet.getRange(row, this.consts.SOURCE_COL).getValue();
    const tags = sheet.getRange(row, this.consts.TAGS_COL).getValue();

    const from = sheet.getRange(row, this.consts.USER_INSTAGRAM_COL).getValue();
    const via = sheet.getRange(row, this.consts.FB_GROUP_COL).getValue();

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
      const response = service.fetch(this.consts.BLOG_POST_URL, options);
      Logger.log(response);
      this._setDoneNumber(sheet, row);

      var date = sheet.getRange(row, this.consts.DATE_COL).getValue();
      var lat = sheet.getRange(row, this.consts.LATITUDE_COL).getValue();
      var lon = sheet.getRange(row, this.consts.LONGITUDE_COL).getValue();
      var address = sheet.getRange(row, this.consts.ADDRESS_COL).getValue();
      var insta = sheet.getRange(row, this.consts.USER_INSTAGRAM_COL).getValue();

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
    sheet.getRange(row, this.consts.DONE_COL).setValue(1);
    Logger.log(this.TAG + '_setDoneNumber() row= ' + row);
  }

  _copyCell(date, name, lat, lon, address, country, city, insta) {
    const sheet = SpreadsheetsUtil.getSheetByName(this.SPREADSHEET, 'Washroom');
    const row = SpreadsheetsUtil.getLastRow(sheet) + 1;

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
