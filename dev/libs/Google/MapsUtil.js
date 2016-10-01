export default class MapsUtil{
  constructor() {
  }

  /**
   * Get a Postal Address from geo location
   * @param {long} longitude number
   * @param {lat} latitude number
   */
  static getStreetAddress (long, lat) {
    var response = Maps.newGeocoder().reverseGeocode(long, lat);
    if(response.status === "OK") {
      return response.results[0].formatted_address;
    }
    return null;
  }
};
