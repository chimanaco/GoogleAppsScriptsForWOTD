import GASMaps from './libs/GAS/Google/GASMaps';
import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import GASInstagram from './libs/GAS/Instagram/GASInstagram';
import consts from './Consts';

export default class Instagram {
  constructor(sheet, lastRow) {
    this.TAG = 'Instagram ';
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
    const isNameExists = GASSpreadsheets.checkIfCellHasValue(this.sheet, this.lastRow, this.consts.NAME_COL);
    Logger.log(`${this.TAG}, writeData() isNameExists=(), ${isNameExists}`);

    if (!isNameExists) {
      // Write Infromation
      this.writeInformationOnRow(this.sheet, this.lastRow);
    }
  }

  /**
   * write some information from the photo on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row to write
   */
  writeInformationOnRow(sheet, row) {
    const url = sheet.getRange(row, this.consts.URL_COL).getValue();
    Logger.log(`${this.TAG}, writeInformationOnRow() url=(), ${url}`);

    const photoData = GASInstagram.getData(url, this.consts.INSTAGRAM_ACCESS_TOKEN);
    const name = photoData.location.name;
    const latitude = photoData.location.latitude;
    const longitude = photoData.location.longitude;
    const tagString = GASInstagram.getTagsAsString(photoData.tags);

    sheet.getRange(row, this.consts.NAME_COL).setValue(name);
    sheet.getRange(row, this.consts.LATITUDE_COL).setValue(latitude);
    sheet.getRange(row, this.consts.LONGITUDE_COL).setValue(longitude);
    sheet.getRange(row, this.consts.TAGS_COL).setValue(tagString);

    // Log
    Logger.log(`${this.TAG}, writeInformationOnRow() name=, ${name}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() latitude=, ${latitude}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() longitude=, ${longitude}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() tagString=, ${tagString}`);

    // Set Address from latitude and longitude
    this.writeLocation(sheet, row, latitude, longitude);

    // Write Date
    this.writeDate(sheet, row);

    // Write Instagram account
    this.writeIGUser(sheet, row);

    // Write Facebook group
    this.writeFBGroup(sheet, row);
  }

  /**
   * write location information on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { number } latitude
   * @param { number } longitude
   */
  writeLocation(sheet, row, latitude, longitude) {
    const address = GASMaps.getStreetAddress(latitude, longitude);
    Logger.log(`${this.TAG}, writeLocation() address=, ${address}`);
    this.writeAddress(sheet, row, address);
    this.writeCountry(sheet, row, address);
  }

  /**
   * write address on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  writeAddress(sheet, row, address) {
    Logger.log(`${this.TAG}, writeAddress() address=, ${address}`);
    sheet.getRange(row, this.consts.ADDRESS_COL).setValue(address);
  }

  /**
   * write country on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  writeCountry(sheet, row, address) {
    const addressSplits = address.split(',');
    Logger.log(`${this.TAG}, writeCountry() addressSplits=, ${addressSplits}`);
    let country = addressSplits.pop();
    country = country.replace(/^\s+|\s+$/g, '');
    Logger.log(`${this.TAG}, writeCountry() country=, ${country}`);
    sheet.getRange(row, this.consts.COUNTRY_COL).setValue(country);
  }

  /**
   * write date on the row
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeDate(sheet, row) {
    const convertedDate = this.convertDate(sheet, row);
    Logger.log(`${this.TAG}, writeDate() convertedDate=, ${convertedDate}`);
    sheet.getRange(row, this.consts.NEW_DATE_COL).setValue(convertedDate);
  }

  /**
   * write instagram user account
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeIGUser(sheet, row) {
    Logger.log(`${this.TAG}, writeIGUser() row=, ${row}`);
    sheet.getRange(row, this.consts.USER_INSTAGRAM_COL).setFormula('=REGEXEXTRACT(B' + row + ',"@{1}[A-Za-z0-9_.-]*")');
  }

  /**
   * write facebook group
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeFBGroup(sheet, row) {
    Logger.log(`${this.TAG}, writeFBGroup() row=, ${row}`);
    sheet.getRange(row, this.consts.FB_GROUP_COL).setFormula('=REGEXEXTRACT(B' + row + ',"our\x20.*p")');
  }

  /**
   * Convert Date from Instagram format to Calendar format
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @return { Object } newDate
   */
  convertDate(sheet, row) {
    const date = sheet.getRange(row, this.consts.ORG_DATE_COL).getValue();
    Logger.log(`${this.TAG}, convertDate() date=, ${date}`);

    const newDate = GASInstagram.getConvertedDate(date);
    Logger.log(`${this.TAG}, convertDate() newDate=, ${newDate}`);

    return newDate;
  }
}

