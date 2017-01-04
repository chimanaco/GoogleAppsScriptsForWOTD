import App from './App';

var TAG = 'main ';

/* fetch instagram
 *
 * @param { }
 * @return { }
 */
global.fetchInstagram = () => {
  Logger.log(TAG + 'get app instance()');
  const app = App.getInstance();
  Logger.log(TAG + 'app fetch instance()');
  app.fetchInstagram();
  Logger.log(TAG + 'fetchInstagram done!()');
}

/* post to Tumblr
 *
 * @param { }
 * @return { }
 */
global.startTumblr = () => {
  Logger.log(TAG + 'get app instance()');
  const app = App.getInstance();
  Logger.log(TAG + 'app tumblr start()');
  app.startTumblr();
  Logger.log(TAG + 'startTumblr done!()');
}

/* post to Tumblr
 *
 * @param { }
 * @return { }
 */
global.startSlack = () => {
  Logger.log(TAG + 'get app instance()');
  const app = App.getInstance();
  Logger.log(TAG + 'app slack start()');
  app.startSlack();
  Logger.log(TAG + 'startslack done!()');
}








