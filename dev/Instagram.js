import StringUtil from './libs/util/StringUtil';
import GASMaps from './libs/GAS/Google/GASMaps';
import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import GASInstagram from './libs/GAS/Instagram/GASInstagram';
import config from './Config';

export default class Instagram {
  constructor() {
    this.TAG = 'Instagram ';
    Logger.log(`${this.TAG}, constructor`);
  }

  /**
   * write data on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   */
  writeData(sheet, row) {
    const isNameExists = GASSpreadsheets.checkIfCellHasValue(sheet, row, config.columns.instagram.name);
    Logger.log(`${this.TAG}, writeData() isNameExists=(), ${isNameExists}`);

    if (!isNameExists) {
      // Write Infromation
      this.writeInformationOnRow(sheet, row);
    }
  }

  /**
   * write data on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row
   */
  writeDataHelp(sheet, row) {
    // Write Date
    this.writeDate(sheet, row);
    const url = sheet.getRange(row, config.columns.instagram.url).getValue();

    Logger.log(`${this.TAG}, scrapeInstagramName() url=, ${url}`);
    const name = this.scrapeName(url);
    sheet.getRange(row, config.columns.instagram.name).setValue(name);

    Logger.log(`${this.TAG}, scrapeInstagramName() id=, ${name}`);
  }

  /**
   * write some information from the photo on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row to write
   */
  writeInformationOnRow(sheet, row) {
    const url = sheet.getRange(row, config.columns.instagram.url).getValue();
    Logger.log(`${this.TAG}, writeInformationOnRow() url=(), ${url}`);

    const photoData = GASInstagram.getData(url, config.instagram.accesToken);
    const name = photoData.location.name;
    const latitude = photoData.location.latitude;
    const longitude = photoData.location.longitude;
    const tagString = GASInstagram.getTagsAsString(photoData.tags);

    sheet.getRange(row, config.columns.instagram.name).setValue(name);
    sheet.getRange(row, config.columns.instagram.latitude).setValue(latitude);
    sheet.getRange(row, config.columns.instagram.longitude).setValue(longitude);
    sheet.getRange(row, config.columns.instagram.tags).setValue(tagString);

    // Log
    Logger.log(`${this.TAG}, writeInformationOnRow() name=, ${name}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() latitude=, ${latitude}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() longitude=, ${longitude}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() tagString=, ${tagString}`);

    // Set Address from latitude and longitude
    this.writeLocation(sheet, row, latitude, longitude);

    // Write Comment
    this.writeComment(sheet, row);

    // Write Date
    this.writeDate(sheet, row);

    // Write Instagram account
    this.writeIGUser(sheet, row);

    // Write Facebook group
    this.writeFBGroup(sheet, row);
  }

  /**
   * write location information on the row
   * @param { Sheet } sheet the sheet in use
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
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  writeAddress(sheet, row, address) {
    Logger.log(`${this.TAG}, writeAddress() address=, ${address}`);
    sheet.getRange(row, config.columns.instagram.address).setValue(address);
  }

  /**
   * write country on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row in use
   * @param { string } address
   */
  writeCountry(sheet, row, address) {
    const addressSplits = address.split(',');
    Logger.log(`${this.TAG}, writeCountry() addressSplits=, ${addressSplits}`);
    let country = addressSplits.pop();
    country = country.replace(/^\s+|\s+$/g, '');
    Logger.log(`${this.TAG}, writeCountry() country=, ${country}`);
    sheet.getRange(row, config.columns.instagram.country).setValue(country);
  }

  /**
   * write date on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeDate(sheet, row) {
    const convertedDate = this.convertDate(sheet, row);
    Logger.log(`${this.TAG}, writeDate() convertedDate=, ${convertedDate}`);
    sheet.getRange(row, config.columns.instagram.date).setValue(convertedDate);
  }

  /**
   * write comment on the row
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeComment(sheet, row) {
    Logger.log(`${this.TAG}, writeComment() convertedDate=, ${row}`);
    sheet.getRange(row, config.columns.instagram.comment).setFormula('=REGEXEXTRACT(B' + row + ',"(.*)")');
  }

  /**
   * write instagram user account
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeIGUser(sheet, row) {
    Logger.log(`${this.TAG}, writeIGUser() row=, ${row}`);
    sheet.getRange(row, config.columns.instagram.userInstagram).setFormula('=REGEXEXTRACT(B' + row + ',"@{1}[A-Za-z0-9_.-]*")');
  }

  /**
   * write facebook group
   * @param { Sheet } sheet the sheet in use
   * @param { number } row the row in use
   */
  writeFBGroup(sheet, row) {
    Logger.log(`${this.TAG}, writeFBGroup() row=, ${row}`);
    sheet.getRange(row, config.columns.instagram.fbGroup).setFormula('=REGEXEXTRACT(B' + row + ',"our\x20.*p")');
  }

  /**
   * Convert Date from Instagram format to Calendar format
   * @param { string } sheet the sheet in use
   * @param { number } row the row in use
   * @return { Object } newDate
   */
  convertDate(sheet, row) {
    const date = sheet.getRange(row, config.columns.instagram.orgDate).getValue();
    Logger.log(`${this.TAG}, convertDate() date=, ${date}`);

    const newDate = GASInstagram.getConvertedDate(date);
    Logger.log(`${this.TAG}, convertDate() newDate=, ${newDate}`);

    return newDate;
  }

  scrapeName(url) {
    Logger.log(`${this.TAG}, scrapeName() url=, ${url}`);
    const name = GASInstagram.scrapeName(url);
    return name;
    // TODO: 変換のコードを書きたい
    // const newName = StringUtil.utf8HexStringToString(name);
    // Logger.log(`${this.TAG}, scrapeName() newName=, ${newName}`);
    // return newName;
    // Logger.log(`${this.TAG}, scrapeDate() newDate=, ${newDate}`);
  }

  writeLocationFromCell(sheet, row) {
    const latitude = GASSpreadsheets.getValueFromCell(sheet, row, config.columns.instagram.latitude);
    const longitude = GASSpreadsheets.getValueFromCell(sheet, row, config.columns.instagram.longitude);

    // Log
    Logger.log(`${this.TAG}, writeInformationOnRow() latitude=, ${latitude}`);
    Logger.log(`${this.TAG}, writeInformationOnRow() longitude=, ${longitude}`);

    // Set Address from latitude and longitude
    this.writeLocation(sheet, row, latitude, longitude);

    // Write Instagram account
    this.writeIGUser(sheet, row);

    // Write Facebook group
    this.writeFBGroup(sheet, row);
  }
}

