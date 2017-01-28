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
    const myRegexp = /display_src": "([\s\S]*?)?ig_cache/i;
    const match = myRegexp.exec(response);
    Logger.log(match);

    const urlString = match[1];
    Logger.log(urlString);

    return urlString;
  }


};
