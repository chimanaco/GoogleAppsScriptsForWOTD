import Month from '../../util/Month';

export default class GASInstagram {

  /**
   * Get an End Point
   * @param { string } url instagram photo url
   * @param { string } accessToken access token
   * @return { Object } data
   */
  static getData(url, accessToken) {
    const endPoint = this.getEndPoint(url, accessToken);
    const response = this.getResponse(endPoint);
    const data = this.getDataFromResponse(response);
    return data;
  }

  /**
   * Get an End Point
   * @param { string } url instagram photo url
   * @param { string } accessToken access token
   * @return { string } endPoint
   */
  static getEndPoint(url, accessToken) {
    const shortCode = url.split("/")[4];
    // console.log("url.split= " + url.split("/"));
    let endPoint = 'https://api.instagram.com/v1/media/shortcode/' + shortCode + '?access_token=' + accessToken;
    return endPoint;
  }

  /**
   * get response with instagram endPoint
   * @param { string } endPoint from instagram API
   * @param { number } row the row in use
   * @return { string } response
   */
  static getResponse(endPoint) {
    // let us fetch the details from API. This will give you the details of photos and URL
    const response = UrlFetchApp.fetch(endPoint).getContentText();
    Logger.log("InstagramUtil _getResponse()= " + response);
    return response;
  }

  /**
   * get data from response
   * @param { string } response json string
   * @return { Object } data
   */
  static getDataFromResponse(response) {
    // parse the JSON string data to JSON
    const responseObj = JSON.parse(response);
    // get photo data
    const data = responseObj.data;
    // console.log("data= " + JSON.stringify(data));

    return data;
  }

  /**
   * Convert Date from Instagram format to Calendar format
   * @param { string } date
   * @return { Object } newDate
   */
  static getConvertedDate(date) {
    const dateSplits = date.split(" ");
    const mString = dateSplits[0]; // month
    const dString = dateSplits[1]; // day + ,
    const yString = dateSplits[2]; // year
    const mNum = Month.getNumber(mString);
    const dNum = dString.split(",")[0];
    const newDate = mNum + "/" + dNum + "/" + yString;

    // console.log("date= " + date);
    // console.log("dateSplits= " + dateSplits);
    // console.log("month= " + mString);
    // console.log("day= " + dString);
    // console.log("year= " + yString);
    // console.log("newMonth= " + mNum);
    // console.log("newDay= " + dNum);
    // console.log("newDate= " + newDate);

    return newDate;
  }

  /**
   * Get tag string from the tag array
   * @param { string[] } tags tags for the photo
   * @return { string } tagString
   */
  static getTagsAsString(tags) {
    let tagString = "";
    const len = tags.length;

    for (var i = 0; i < len; i++) {
      tagString += tags[i];
      if (i < len - 1) {
        tagString += ",";
      }
    }
    // console.log("tags= " + tags);
    // console.log("len= " + len);
    // console.log("tagString= " + tagString);
    return tagString;
  }
};
