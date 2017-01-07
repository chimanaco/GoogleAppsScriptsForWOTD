import App from './App';

const TAG = 'main ';
const app = App.getInstance();

/* write data from Instagram info
 *
 * @param { }
 * @return { }
 */
global.writeDataFromInstagramInfo = () => {
  Logger.log(`${TAG}, writeDataFromInstagramInfo()`);
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
  app.scrapeInstagramImageViaSlack();
  Logger.log(`${TAG}, scrapeInstagramImageViaSlack() done`);
}








