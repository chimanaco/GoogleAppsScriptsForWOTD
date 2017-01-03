"use strict";

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






