"use strict";

import Instagram from './Instagram';

let _appInstance = null;

export default class App {
  constructor() {
    this.TAG = 'App ';
    Logger.log(this.TAG + "Constructor");

      if(_appInstance !== null){
        Logger.log("Do App.getInstance()");
        throw new Error("Do App.getInstance()");
      }

      if(_appInstance === null){
          Logger.log(this.TAG + "No Instance yet");
          _appInstance = this;
      }
  }

  static getInstance() {
    if(_appInstance === null) {
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

  /* write json to Sheet
   *
   * @write2Sheet
   * @param {}
   */
  write2SheetFromJsonOnServer () {
    Logger.log(this.TAG + "write2SheetFromJsonOnServer()");

    // parse the JSON string data to JSON
    const responseObj = this._getJsonFromAWS();
    // Clear values from the sheet
    this._clearSheet();

    // Write values on the sheet
    this._writeJsonToSheet(responseObj);
  }

  /* write json to Sheet
   *
   * @save2S3
   * @param {}
   */
  saveJson2S3(){
    Logger.log(this.TAG + "saveJson2S3()");
    const s3 = this._getS3Instance();
    var fileName = 'banner/' + this.SHEET_NAME + '/' + 'banner';
    s3.putObject( this.BUCKET_NAME , [fileName,"json"].join("."),this._getJsonFroSheet(this.SHEET, this.SHEET_NAME));
  }

  /**
   * Dialog from Writing
   * @param {}
   */
  showWriteDialog(bucket){
    Logger.log(this.TAG + "showWriteDialog()");
    this._setBucket(bucket);

    const yesNoString = this._getYesNoString('からシートに読み込みますか?');
    const result = this._getYesNoAlert(yesNoString);
    const cancelString = this._getEnvironmentStringFromBucket(bucket) + 'からのデータの読み込みを中止しました';

    if (result == this.UI.Button.YES) {
      // User clicked "Yes".
      this.write2SheetFromJsonOnServer();
    } else {
      // User clicked "No" or X in the title bar.
      this.UI.alert(cancelString);
    }
  }

  /**
   * Dialog from Uploading
   * @param {}
   */
  showUploadDialog(bucket){
    this._setBucket(bucket);

    Logger.log(this.TAG + "showUploadDialog()");

    const yesNoString = this._getYesNoString('に反映しますか?');
    const result = this._getYesNoAlert(yesNoString);
    const cancelString = this._getEnvironmentStringFromBucket(bucket) + 'へのバナー情報の更新を中止しました';

    if (result == this.UI.Button.YES) {
      // User clicked "Yes".
      this.saveJson2S3();
    } else {
      // User clicked "No" or X in the title bar.
      this.UI.alert(cancelString);
    }
  }

  /**
   * Dialog from Uploading
   * @param {}
   */
  validate(){
    Logger.log(this.TAG + 'validate()');
    var lastRow = this.SHEET.getLastRow();
    Validator.validateSelectedRows(this.SHEET, this.START_ROW, lastRow);
  }

  /* set bucket to this instance
   *
   * @setBucket_
   * @param {string} bucket
   */
  _setBucket(bucket){
    Logger.log(this.TAG + "bucket=" + bucket);
    this.BUCKET_NAME = bucket;
  }
  
  _getJsonFroSheet() {
    Logger.log(this.TAG + "_getJsonFroSheet()" + '' + this.SHEET_NAME);
    // シートの一部分を取得する
    var rowIndex = this.START_ROW - 1;
    var colStartIndex = 1;
    var rowNum = 1;
    var keys = this.SHEET.getSheetValues(rowIndex, colStartIndex, rowNum, this.LAST_COL)[0];
    var data = this.SHEET.getRange(rowIndex + 1, colStartIndex, this.SHEET.getLastRow(), this.SHEET.getLastColumn()).getValues();

    var list = [];

    data.forEach( (elm, index) => {
      const template = this.indexBy(keys);
      const member = this.generate(elm,template);
      if(member.alt){
        list[index] = member;
      }
    });

    var listObj = {
      "lang": this.SHEET_NAME,
      "banners": list
    }
    return listObj;
  }

  generate(elm,obj){
    Logger.log(this.TAG + "generate()" + '' + this.SHEET_NAME);

    var i = 0;
    for(var key in obj){
      if ( obj[key] == "img" ) {
        obj[key] = this.DIRECTOY_PATH + this.SHEET_NAME + "/" + elm[i];
      } else {
        obj[key] = elm[i];
      }
      i++;
    }
    return obj;
  }

  indexBy(ary){
    var obj = {};
    for(var i = 0, len = ary.length; i < len; i++){
      var key = ary[i];
      obj[key] = key;
    }
    return obj;
  }


  /**
   * Get Json from AWS
   * @param {}
   */
  _getJsonFromAWS () {
    Logger.log(this.TAG + "_getJsonFromAWS()");

    const s3 = this._getS3Instance();
    const s3Object = S3Util.getS3Object(s3, this.BUCKET_NAME, "banner/" + this.SHEET_NAME + "/banner" + ".json");

    const responseObj = JsonUtil.getJsonObject(s3Object);
    return responseObj;
  }

  /**
   * write Json to Sheet
   * @param {object} object
   */
  _writeJsonToSheet (object) {
    Logger.log(this.TAG + "_writeJsonToSheet()");
    for(var i = 0; i < object.banners.length; i++) {
      var altData = object.banners[i].alt;
      var imgData = object.banners[i].img.match(".+/(.+?)$")[1];
      var urlData = object.banners[i].url;
      var row = i + this.START_ROW;
      this.SHEET.getRange(row, 1).setValue(altData);
      this.SHEET.getRange(row, 2).setValue(imgData);
      this.SHEET.getRange(row, 3).setValue(urlData);
    }
  }

  /**
   * Clear values from Sheet
   * @param {}
   */
  _clearSheet () {
    Logger.log(this.TAG + "_clearSheet()");
    var lastRow = this.SHEET.getLastRow() + 1;

    for (var i = this.START_ROW; i < lastRow; i++) {
      var row = i;

      for(let j = 1; j < 4; j ++) {
        this.SHEET.getRange(row, j).clear();
      }
    }
  }

  /**
   * Get S3 Instance
   * @param { }
   */
  _getS3Instance () {
    Logger.log(this.TAG + '_getS3Instance() ' + this.AWS_ACCESSKEY_ID + ", " + this.AWS_SECRET_KEY);

    const s3 = S3.getInstance(this.AWS_ACCESSKEY_ID, this.AWS_SECRET_KEY);
    return s3;
  }

  /**
   * Get EnvironmentString from Bucket
   * @param {string} bucket 'jnto.staging' or 'visitjapan-europe.jnto.go.jp'
   * @return {string} envString 'テスト環境' or '本番環境'
   */
  _getEnvironmentStringFromBucket (bucket) {
    Logger.log(this.TAG + "_getEnvironmentStringFromBucket()");
    var envString;
    if(bucket == 'jnto.staging') {
      envString = 'テスト環境';
    } else {
      envString = '本番環境';
    }
    return envString;
  }

  /**
   * Get String for YES_NO Alert
   * @param {string} after 追加する文字列
   * @return {string} alertString アラートに出す文字列
   */
  _getYesNoString(after){
    Logger.log(this.TAG + "_getYesNoString()");

    const envString = this._getEnvironmentStringFromBucket(this.BUCKET_NAME);
    const langString = LanguageUtil.convertShortenedToString(this.SHEET_NAME);
    const alertString = langString + 'のバナー情報を' + envString + after;

    return alertString;
  }

  /**
   * Get String for YES_NO Alert
   * @param {string} after 追加する文字列
   * @return {string} alertString アラートに出す文字列
   */
  _getYesNoAlert(string){
    Logger.log(this.TAG + "_getYesNoAlert()");
    const result = this.UI.alert(
      string,
      this.UI.ButtonSet.YES_NO);

    return result;
  }
};
