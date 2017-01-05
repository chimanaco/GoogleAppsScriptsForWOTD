export default class GASMaps {
  /**
   * Get a Postal Address from geo location
   * @param { number } long longi tude
   * @param { number } lat latitude
   */
  static getStreetAddress(long, lat) {
    var response = Maps.newGeocoder().reverseGeocode(long, lat);
    if (response.status === "OK") {
      return response.results[0].formatted_address;
    }
    return null;
  }
};
