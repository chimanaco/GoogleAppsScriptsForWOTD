export default class StringUtil {
  /**
   * remove Angle Brackets
   * @param { string } sheet the sheet in use
   * @return { string } str
   */
  static removeAngleBrackets(str) {
    str = str.replace(/</g, '');
    str = str.replace(/>/g, '');
    return str;
  }
}
