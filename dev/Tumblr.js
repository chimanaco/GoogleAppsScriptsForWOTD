import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';
import GASTumblr from './libs/GAS/Tumblr/GASTumblr';
import config from './Config';

export default class Tumblr {
  constructor(sheet, lastRow) {
    this.TAG = 'Tumblr ';
    Logger.log(`${this.TAG}, constructor`);
    Logger.log(`${this.TAG}, constructor config=, ${config.instagram.accesToken}, `);

    this.sheet = sheet;
    this.lastRow = lastRow;
  }

  /**
   * write data on the spreadsheet
   * @param { }
   */
  writeData() {
    const rowToStart = GASSpreadsheets.getRowToStart(
      this.sheet,
      this.lastRow,
      config.columns.instagram.done);

    Logger.log(`${this.TAG}, writeData() rowToStart=, ${rowToStart}`);

    if (rowToStart !== '' && rowToStart > 0) {
      // this.goPosts(this.sheet, rowToStart, this.lastRow);
      for (let i = rowToStart; i < this.lastRow + 1; i++) {
        Logger.log(`${this.TAG}, writeData() isDone=Post:, ${i}`);
        this.tumblrPost(this.sheet, i);
      }
    }
  }

  tumblrPost(sheet, row) {
    Logger.log(`${this.TAG}, tumblrPost() row=, ${row}`);
    const service = GASTumblr.getTumblrService(config.tumblr.consumerKey, config.tumblr.consumerSecret);
    Logger.log(`${this.TAG}, tumblrPost() service=, ${service}`);

    if (service.hasAccess()) {
      Logger.log(`${this.TAG}, tumblrPost() service=, ${service}`);

      const caption = this.getCaption(sheet, row);
      const source = sheet.getRange(row, config.columns.instagram.source).getValue();
      const tags = sheet.getRange(row, config.columns.instagram.tags).getValue();

      // Post to photo
      GASTumblr.postPhoto(service, config.tumblr.postUrl, caption, source, tags);

      // TODO: want to do this when posting is successfully done
      this.afterPosting(sheet, row);
    } else {
      const authorizationUrl = service.authorize();
      Logger.log(`Please visit the following URL and then re-run the script: , ${authorizationUrl}`);
    }
  }

  /**
   * Get caption from the row
   * @param { Sheet } sheet
   * @param { number } row
   * @return { string } caption
   */
  getCaption(sheet, row) {
    const name = sheet.getRange(row, config.columns.instagram.name).getValue();
    const country = sheet.getRange(row, config.columns.instagram.country).getValue();
    const city = sheet.getRange(row, config.columns.instagram.city).getValue();
    let caption = `${name}, \n, ${city}, ' ', ${country}`;
    const from = sheet.getRange(row, config.columns.instagram.userInstagram).getValue();
    const via = sheet.getRange(row, config.columns.instagram.fbGroup).getValue();

    Logger.log(`${this.TAG}, getCaption() from=, ${from}`);
    Logger.log(`${this.TAG}, getCaption() via=, ${via}`);

    if (from !== '#N/A') {
      Logger.log(`${this.TAG}, From exists=, ${from}`);
      // Add Instagram link text
      caption += this.getInstagramLinkText(from);
    } else if (via !== '#N/A') {
      Logger.log(`${this.TAG}, Via exists=, ${via}`);
      // Add FB Group link text
      caption += this.getFBGroupLinkText(via);
    }
    return caption;
  }

  /**
   * after posting
   * @param { Sheet } sheet
   * @param { number } row
   */
  afterPosting(sheet, row) {
    // set number after posting
    this.setDoneNumber(sheet, row);
    // copy values into 'copy' sheet
    const copyValues = this.getValuesForCopying();
    this.copyCell(copyValues);

  }

  /**
   * Get caption from the row
   * @param { Sheet } sheet
   * @param { number } row
   * @return { string } caption
   */
  setDoneNumber(sheet, row) {
    sheet.getRange(row, config.columns.instagram.done).setValue(1);
    Logger.log(`${this.TAG}, setDoneNumber()=, ${row}`);
  }

  /**
   * copy values to copy sheet done number
   * @return { object } values
   */
  copyCell(values) {
    const sheet = config.spreadSheet.sheet.copy;
    const row = GASSpreadsheets.getLastRow(sheet) + 1;
    sheet.getRange(row, config.columns.copy.date).setValue(values.date);
    sheet.getRange(row, config.columns.copy.name).setValue(values.name);
    sheet.getRange(row, config.columns.copy.lat).setValue(values.lat);
    sheet.getRange(row, config.columns.copy.lon).setValue(values.lon);
    sheet.getRange(row, config.columns.copy.address).setValue(values.address);
    sheet.getRange(row, config.columns.copy.country).setValue(values.country);
    sheet.getRange(row, config.columns.copy.city).setValue(values.city);
    sheet.getRange(row, config.columns.copy.userInstagram).setValue(values.insta);
    Logger.log(`${this.TAG}, copyCell() sheet=, ${sheet.getName()}`);
    Logger.log(`${this.TAG}, copyCell() row=, ${row}`);
    Logger.log(`${this.TAG}, copyCell() Done`);
  }

  /**
   * get values for copying
   * @param {  }
   * @return { object } values
   */
  getValuesForCopying() {
    const name = sheet.getRange(row, config.columns.instagram.name).getValue();
    const country = sheet.getRange(row, config.columns.instagram.country).getValue();
    const city = sheet.getRange(row, config.columns.instagram.city).getValue();
    const date = sheet.getRange(row, config.columns.instagram.date).getValue();
    const lat = sheet.getRange(row, config.columns.instagram.latitude).getValue();
    const lon = sheet.getRange(row, config.columns.instagram.longitude).getValue();
    const address = sheet.getRange(row, config.columns.instagram.address).getValue();
    const insta = sheet.getRange(row, config.columns.instagram.userInstagram).getValue();

    const values = {
      name,
      country,
      city,
      date,
      lat,
      lon,
      address,
      insta,
    };
    return values;
  }

  getInstagramLinkText(from) {
    Logger.log(`${this.TAG}, getInstagramLinkText() from=, ${from}`);
    let text = '\n';
    const userName = from.substr(1);
    text += 'from ';
    Logger.log(`<a href="https://www.instagram.com/, ${userName}, "`);
    text += from;
    text += '</a>';
    return text;
  }

  getFBGroupLinkText(via) {
    Logger.log(`${this.TAG}, getFBGroupLinkText() Via=, ${via}`);
    let text = '\n';
    text += 'via ';
    text += '<a href="https://www.facebook.com/groups/washroom.of.the.day/">'
    text += via;
    text += '</a>';
    return text;
  }
}
