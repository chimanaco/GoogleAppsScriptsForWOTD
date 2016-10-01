export default class Month{
  constructor() {
  }

  /**
   * Get month by number
   * @param {string} monthString string
   */
  static getNumber(monthString) {
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    var monthNumber = 0;
    var len = months.length;
    for(var i = 0; i < len; i ++) {
      if(months[i] == monthString) {
        monthNumber = i + 1;
      }
    }

    return monthNumber;
  }
};
