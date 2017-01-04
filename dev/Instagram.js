import MapsUtil from './libs/Google/MapsUtil.js';
import InstagramUtil from './libs/Instagram/InstagramUtil';
import consts from './Consts';

export default class Instagram {
  constructor() {
    this.TAG = 'Instagram ';
    Logger.log(`${this.TAG}, constructor`);

    this.consts = consts.getAll();

    this.init();
  }

  /**
   * write data on the spreadsheet
   * @param { }
   */
  writeData() {
    const isNameExists = this._checkIfNameExists(this.lastRow);
    Logger.log(this.TAG + "writeData() isNameExists=" + isNameExists);

    if (!isNameExists) {
      // Write Infromation
      this._writeInformationOnRow(this.sheet, this.lastRow);
    }
  }

  /**
   * init spreadsheet
   * @param { }
   */
  init() {
    // sheet
    this.SHEET_NAME = 'Instagram';

    this.sheet = this.consts.SPREADSHEET.getSheetByName(this.SHEET_NAME);
    Logger.log(`${this.TAG}, init() sheet= , ${this.sheet.getName()}`);

    // last row
    this.lastRow = this.sheet.getLastRow();
    Logger.log(`${this.TAG}, init() lastRow= , ${this.lastRow}`);
  }

  /**
   * check if the row is done or not
   * @param { number } row the row to check
   * @return { boolean } isExists
   */
  _checkIfNameExists(row) {
    // Get Name value to test
    const nameValue = this.sheet.getRange(row, this.consts.NAME_COL).getValue();
    Logger.log(nameValue);

    let isExists = false;
    if (nameValue.length > 0) {
      isExists = true;
    }
    Logger.log(this.TAG + 'checkIfNameExists= ' + isExists);
    return isExists;
  }

  /**
   * write some information from the photo on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row to write
   */
  _writeInformationOnRow(sheet, row) {
    const url = sheet.getRange(row, this.consts.URL_COL).getValue();
    Logger.log(this.TAG + '_writeInformationOnRow url= ' + url);

    const photoData = InstagramUtil.getData(url, this.consts.INSTAGRAM_ACCESS_TOKEN);

    const name = photoData.location.name;
    const latitude = photoData.location.latitude;
    const longitude = photoData.location.longitude;
    const tagString = this._getTagString(photoData.tags);

    sheet.getRange(row, this.consts.NAME_COL).setValue(name);
    sheet.getRange(row, this.consts.LATITUDE_COL).setValue(latitude);
    sheet.getRange(row, this.consts.LONGITUDE_COL).setValue(longitude);
    sheet.getRange(row, this.consts.TAGS_COL).setValue(tagString);

    // Log
    Logger.log(this.TAG + "_setInformation() name= " + name);
    Logger.log(this.TAG + "_setInformation() latitude= " + latitude);
    Logger.log(this.TAG + "_setInformation() longitude= " + longitude);
    Logger.log(this.TAG + "_setInformation() tagString= " + tagString);

    // Set Address from latitude and longitude
    this._writeLocation(sheet, row, latitude, longitude);

    // Write Date
    this._writeDate(sheet, row);

    // Write Instagram account
    this._writeIGUser(sheet, row);

    // Write Facebook group
    this._writeFBGroup(sheet, row);
  }

  /**
   * write location information on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { number } latitude
   * @param { number } longitude
   */
  _writeLocation(sheet, row, latitude, longitude) {
    const address = MapsUtil.getStreetAddress(latitude, longitude);
    Logger.log(this.TAG + "_writeLocation() address= " + address);
    this._writeAddress(sheet, row, address);
    this._writeCountry(sheet, row, address);
  }

  /**
   * write address on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  _writeAddress(sheet, row, address) {
    Logger.log(this.TAG + "_writeAddress() address= " + address);
    sheet.getRange(row, this.consts.ADDRESS_COL).setValue(address);
  }

  /**
   * write country on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  _writeCountry(sheet, row, address) {
    const addressSplits = address.split(",");
    Logger.log(this.TAG + "_writeCountry() addressSplits= " + addressSplits);
    let country = addressSplits.pop();
    country = country.replace(/^\s+|\s+$/g, "");
    Logger.log(this.TAG + "_writeCountry() country= " + country);
    sheet.getRange(row, this.consts.COUNTRY_COL).setValue(country);
  }

  /**
   * write date on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  _writeDate(sheet, row) {
    const convertedDate = this._convertDate(sheet, row);
    Logger.log(this.TAG + "_writeDate() convertedDate= " + convertedDate);
    sheet.getRange(row, this.consts.NEW_DATE_COL).setValue(convertedDate);
  }

  /**
   * write instagram user account
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  _writeIGUser(sheet, row) {
    Logger.log(this.TAG + "_writeIGUser()");
    sheet.getRange(row, this.consts.USER_INSTAGRAM_COL).setFormula('=REGEXEXTRACT(B' + row + ',"@{1}[A-Za-z0-9_.-]*")');
  }

  /**
   * write facebook group
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  _writeFBGroup(sheet, row) {
    Logger.log(this.TAG + "_writeFBGroup()");
    sheet.getRange(row, this.consts.FB_GROUP_COL).setFormula('=REGEXEXTRACT(B' + row + ',"our\x20.*p")');
  }

  /**
   * Get tag string from the tag array
   * @param { string[] } tags tag for the photo
   * @return { string } tagString
   */
  _getTagString(tags) {
    Logger.log(this.TAG + "_getTagString() tags= " + tags);
    const tagsString = InstagramUtil.getTagsAsString(tags);
    Logger.log(this.TAG + "_getTagString() tagsString= " + tagsString);
    return tagsString;
  }

  /**
   * Convert Date from Instagram format to Calendar format
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @return { Object } newDate
   */
  _convertDate(sheet, row) {
    const date = sheet.getRange(row, this.consts.ORG_DATE_COL).getValue();
    Logger.log(this.TAG + "_convertDate() date= " + date);

    const newDate = InstagramUtil.getConvertedDate(date);
    Logger.log(this.TAG + "_convertDate() newDate= " + newDate);

    return newDate;
  }
}

