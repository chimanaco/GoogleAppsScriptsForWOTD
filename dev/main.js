import App from './App';

const TAG = 'main ';
let app = App.getInstance();

/* write data from Instagram info
 *
 * @param { }
 * @return { }
 */
global.writeDataFromInstagramInfo = () => {
  Logger.log(`${TAG}, writeDataFromInstagramInfo()`);
  app = App.getInstance();
  app.writeDataFromInstagramInfo();
  Logger.log(`${TAG}, writeDataFromInstagramInfo() done`);
}

/* post to Tumblr
 *
 * @param { }
 * @return { }
 */
global.postToTumblr = () => {
  Logger.log(`${TAG}, postToTumblr()`);
  app = App.getInstance();
  app.postToTumblr();
  Logger.log(`${TAG}, postToTumblr() done`);
}

/* Scrape Instagram Image via Slack
 *
 * @param { }
 * @return { }
 */
// global.startSlack = () => {
global.scrapeInstagramImageViaSlack = () => {
  Logger.log(`${TAG}, scrapeInstagramImageViaSlack()`);
  app = App.getInstance();
  app.scrapeInstagramImageViaSlack();
  Logger.log(`${TAG}, scrapeInstagramImageViaSlack() done`);
}








