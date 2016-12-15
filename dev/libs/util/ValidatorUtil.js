export default class ValidatorUtil{
  constructor() {
  }

  /* validate URL with regular expression
   *
   * @validateURL
   * @param {string} string to validate
   *
   * @return {bool} isValid
   */
  static validateURL (string) {
    var isValid = false;
    var check = string.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/i);

    if(check) {
      isValid = true;
    }
    return isValid;
  }

  /* validate imageFile with regular expression
   *
   * @validateImageFile
   * @param {string} string to validate
   *
   * @return {bool} isValid
   */
  static validateImageFile (string) {
    //var isValid = string.match(/^\w+\.(gif|png|jpg|jpeg)$/i);
    var isValid = false;
    var check = string.match(/^[0-9a-zA-Z-_]+\.(gif|png|jpg|jpeg)$/i);

    if(check) {
      isValid = true;
    }
    return isValid;
  }
};