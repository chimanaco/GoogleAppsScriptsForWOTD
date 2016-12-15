"use strict";

export default class LanguageUtil {
  constructor() {
  }

  /**
   * Convert Shortend into Language String
   * @param {string} lang e.g 'en', 'de'
   * @return {string} langString e.g '英語', 'ドイツ語'
   */
  static convertShortenedToString(lang) {
    let langString = '英語';  // default

    if(lang == 'de') {
      langString = 'ドイツ語';
    } else if (lang == 'es') {
      langString = 'スペイン語';
    }  else if (lang == 'fr') {
      langString = 'フランス語';
    }  else if (lang == 'it') {
      langString = 'イタリア語';
    }
    return langString;
  }
};
