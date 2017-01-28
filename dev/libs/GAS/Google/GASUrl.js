export default class GASUtil {
  /**
   * get response Object from URL
   * @param { string } url
   * @return { object } responseObj
   */
  static getResponseObject(url) {
    const response = UrlFetchApp.fetch(url).getContentText();
    Logger.log(response);

    const responseObj = JSON.parse(response);
    Logger.log(responseObj);

    return responseObj;
  }
};
