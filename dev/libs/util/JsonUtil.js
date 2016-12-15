export default class JsonUtil{
  constructor() {
  }

  /**
   * Get Json Object
   * @param {object} jsonObject string
   */
  static getJsonObject (object) {
    const jsonString = this.getJsonString(object);

    //parse the JSON string data to JSON
    const jsonObj = JSON.parse(jsonString);
    return jsonObj;
  }
  
  /**
   * Get month by number
   * @param {object} jsonObject string
   */
  static getJsonString (object) {
    const jsonString = JSON.stringify(object);
    return jsonString;
  }
};
