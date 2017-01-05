export default class GASSpreadsheets {
  /**
   * Get a spreadsheet
   * @param { string } spreadSheetId
   * @return { Spreadsheet } spreadsheet
   */
  static getSpreadSheetById(spreadSheetId) {
    const spreadsheet = SpreadsheetApp.openById(spreadSheetId);
    Logger.log(`getSpreadSheetById() shspreadsheeteet=, ${spreadsheet}`);
    return spreadsheet;
  }

  /**
   * Get a sheet by name
   * @param { string } id SPREADSHEET_ID
   * @param { string } name sheet name
   */
  // static getSheet (sheetID, sheetName) {
  //   var spreadsheet = SpreadsheetApp.openById(sheetID);
  //   var sheet = spreadsheet.getSheetByName(sheetName);
  //   return sheet;
  // }
  /**
   * Get a sheet by name
   * @param { Spreadsheet } spreadsheet
   * @param { string } sheetName
   * @return { Sheet } sheet
   */
  static getSheetByName(spreadSheet, sheetName) {
    const sheet = spreadSheet.getSheetByName(sheetName);
    Logger.log(`getSheetByName() sheet=, ${sheet.getName()}`);
    return sheet;
  }

  /**
   * Get last row
   * @param { Sheet } sheet
   * @return { number } lastRow
   */
  static getLastRow(sheet) {
    // last row
    const lastRow = sheet.getLastRow();
    Logger.log(`$getLastLow() lastRow=, ${lastRow}`);
    return lastRow;
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
    const cell = sheet.getRange(row, col);
    const value = cell.getValue();
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
    const cell = sheet.getRange(row, col);
    return cell;
  }

  /**
   * check if the cell has value
   * @param { Sheet } sheet
   * @param { number } row for the cell
   * @param { number } col for the cell
   * @return { boolean } hasValue
   */
  static checkIfCellHasValue(sheet, row, col) {
    // Get cell value to check
    const cellValue = sheet.getRange(row, col).getValue();
    Logger.log(`checkIfCellHasValue() cellValue=, ${cellValue}`);

    let hasValue = false;
    if (cellValue !== '') {
      hasValue = true;
    }
    Logger.log(`checkIfCellHasValue() hasValue=, ${hasValue}`);

    return hasValue;
  }
}
