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
  static getSheet (sheetID, sheetName) {
    var spreadsheet = SpreadsheetApp.openById(sheetID);
    var sheet = spreadsheet.getSheetByName(sheetName);
    return sheet;
  }

  /* Get active Sheet
   *
   * @getActiveSheet
   * @param {}
   *
   * @return {Sheet} active sheet
   */
  static getActiveSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    return sheet;
  }

  /* Get active Sheet
   *
   * @getActiveSheet
   * @param {}
   *
   * @return {Range} active cell
   */
  static getActiveCell() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const cell = sheet.getActiveCell();
    return cell;
  }

  /* Get value from cell
   *
   * @getValueFromCell
   * @param {Spreadsheet} sheet
   * @param {Number} row
   * @param {Number} col
   *
   * @return {string|Number} value
   */
  static getValueFromCell(sheet, row, col) {
    var cell = sheet.getRange(row, col);
    var value = cell.getValue();
    return value;
  }

  /* Get value from cell
   *
   * @getValueFromCell
   * @param {Spreadsheet} sheet
   * @param {Number} row
   * @param {Number} col
   *
   * @return {string|Number} value
   */
  static getCellFromRange(sheet, row, col) {
    var cell = sheet.getRange(row, col);
    return cell;
  }

};
