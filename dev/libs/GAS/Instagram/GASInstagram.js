import Month from '../../util/Month';
import GASUrl from '../Google/GASUrl';

export default class GASInstagram {

  /**
   * Get an End Point
   * @param { string } url instagram photo url
   * @param { string } accessToken access token
   * @return { Object } data
   */
  static getData(url, accessToken) {
    const endPoint = this.getEndPoint(url, accessToken);
    const response = GASUrl.getResponse(endPoint);
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
    const shortCode = url.split('/')[4];
    // console.log("url.split= " + url.split("/"));
    const endPoint = 'https://api.instagram.com/v1/media/shortcode/' + shortCode + '?access_token=' + accessToken;
    return endPoint;
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
    const dateSplits = date.split(' ');
    const mString = dateSplits[0]; // month
    const dString = dateSplits[1]; // day + ,
    const yString = dateSplits[2]; // year
    const mNum = Month.getNumber(mString);
    const dNum = dString.split(',')[0];
    const newDate = mNum + '/' + dNum + '/' + yString;

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
    let tagString = '';
    const len = tags.length;

    for (var i = 0; i < len; i++) {
      tagString += tags[i];
      if (i < len - 1) {
        tagString += ',';
      }
    }
    // console.log("tags= " + tags);
    // console.log("len= " + len);
    // console.log("tagString= " + tagString);
    return tagString;
  }

  /**
   * Get tag string from the tag array
   * @param { string } url instagram url
   * @return { string } urlString
   */
  static scrapeImage(url) {
    const response = GASUrl.getResponse(url);
    // display_url": " と " の間の文字列を取得
    // http://www.usamimi.info/~sutara/sample/regexp_01.php
    // http://stackoverflow.com/questions/16568011/regular-expression-to-escape-double-quotes-within-double-quotes
    const myRegexp = /display_url": "([\s\S]*?)"/g;
    const match = myRegexp.exec(response);

    Logger.log('/////////////response/////////////////////');
    Logger.log(response);

    Logger.log('/////////////match/////////////////////');
    Logger.log(match);

    const urlString = match[1];
    Logger.log('/////////////URL/////////////////////');
    Logger.log(urlString);

    return urlString;
  }

  /**
   * Get date string from the URL
   * @param { string } url instagram url
   * @return { string } urlString
   */
  static scrapeName(url) {
    const response = GASUrl.getResponse(url).toString();
    // display_url": " と " の間の文字列を取得
    // http://www.usamimi.info/~sutara/sample/regexp_01.php
    // http://stackoverflow.com/questions/16568011/regular-expression-to-escape-double-quotes-within-double-quotes
    const myRegexp = /has_public_page": true, "name": "([\s\S]*?)"/g;

    Logger.log('/////////////myRegexp/////////////////////');
    Logger.log(myRegexp);

    const match = myRegexp.exec(response);

    Logger.log('/////////////response/////////////////////');
    Logger.log(response);

    Logger.log('/////////////match/////////////////////');
    Logger.log(match);

    const urlString = match[1];
    Logger.log('/////////////URL/////////////////////');
    Logger.log(urlString);

    return urlString;
  }
};
