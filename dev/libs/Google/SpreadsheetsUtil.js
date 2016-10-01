export default class SpreadsheetsUtil{
  constructor() {
  }

  /**
   * init
   * @param { } nothing
   */
  static init () {
    this.scriptProperties = PropertiesService.getScriptProperties();
  }

  /**
   * Get a spreadsheet
   * @param { } nothing
   */
  static getSpreadSheet () {
    const SPREADSHEET_ID = this.scriptProperties.getProperty("spreadsheet_id");
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log(spreadsheet);
    return spreadsheet;
  }

  /**
   * Get a sheet
   * @param { string } id SPREADSHEET_ID
   * @param { string } name sheet name
   */
  // static getSheet (id, name) {
  //   const SPREADSHEET_ID = this.scriptProperties.getProperty("spreadsheet_id");
  //   var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  //   Logger.log(spreadsheet);
  //   return spreadsheet;
  // }

};
