"use strict";
import Hello from './Hello.js';
import Month from './libs/util/Month.js';

global.callYout = function() {
	Logger.log( Hello.testFunc('yamamoto100') );
	Logger.log( Month.getNumber('April') );
}





