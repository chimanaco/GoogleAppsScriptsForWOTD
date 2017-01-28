export default class GASUrl {
  /**
   * get response from URL
   * @param { string } url
   * @return { HTTPResponse } response
   */
  static getResponse(url) {
    const response = UrlFetchApp.fetch(url);
    Logger.log(response);
    return response;
  }

  /**
   * get response context from URL
   * @param { string } url
   * @return { string } context
   */
  static getResponseContext(url) {
    const response = this.getResponse(url);
    const context = response.getContentText();
    Logger.log(context);
    return context;
  }

  /**
   * get response Object from URL
   * @param { string } url
   * @return { object } responseObj
   */
  static getResponseObject(url) {
    const response = this.getResponseContext(url);
    const responseObj = JSON.parse(response);
    Logger.log(responseObj);

    return responseObj;
  }
};
