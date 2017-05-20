import App from './App';

const TAG = 'main ';
const app = App.getInstance();

/**
 * Write Data From Instagram Info
 */
global.writeDataFromInstagramInfo = () => {
  Logger.log(`${TAG}, writeDataFromInstagramInfo()`);
  app.writeDataFromInstagramInfo();
  Logger.log(`${TAG}, writeDataFromInstagramInfo() done`);

}

/**
 * post to Tumblr
 */
global.postToTumblr = () => {
  Logger.log(`${TAG}, postToTumblr()`);
  app.postToTumblr();
  Logger.log(`${TAG}, postToTumblr() done`);
}

/**
 * Scrape Instagram Image via Slack
 */
global.scrapeInstagramImageViaSlack = () => {
  Logger.log(`${TAG}, scrapeInstagramImageViaSlack()`);
  app.scrapeInstagramImageViaSlack();
  Logger.log(`${TAG}, scrapeInstagramImageViaSlack() done`);
}

/**
 * Scrape Instagram Image info Manually
 */
global.writeDataFromInstagramInfoRecover = () => {
  Logger.log(`${TAG}, writeDataFromInstagramInfoRecover()`);
  app.writeDataFromInstagramInfoRecover();
  Logger.log(`${TAG}, writeDataFromInstagramInfoRecover() done`);
}

/**
 * Get Address and write on cells from Lat and Lon
 */
global.writeAdressFromLatLon = () => {
  Logger.log(`${TAG}, writeAdressFromLatLon()`);
  app.writeAdressFromLatLon();
  Logger.log(`${TAG}, writeAdressFromLatLon() done`);
}








