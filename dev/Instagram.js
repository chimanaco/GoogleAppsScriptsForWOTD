"use strict";

import Month from './libs/util/Month.js';
import MapsUtil from './libs/Google/MapsUtil.js';
import SpreadsheetsUtil from './libs/Google/SpreadsheetsUtil';

const scriptProperties = PropertiesService.getScriptProperties();

global.fetchInstagram = () => {
	Logger.log("Instagram fetch");

	SpreadsheetsUtil.init();
	const spreadsheet = SpreadsheetsUtil.getSpreadSheet();
	Logger.log(spreadsheet);

	const SHEET_NAME = scriptProperties.getProperty("sheet_name");

	//var sheet = spreadsheet.getActiveSheet();
	const sheet = spreadsheet.getSheetByName(SHEET_NAME);
	Logger.log(sheet);

	const row = sheet.getLastRow();
	Logger.log(row);

	// Get Name to test
	const name = sheet.getRange(row, 6).getValue();
	Logger.log(name);

	if(name.length > 0) {
		Logger.log('Exists');
	} else {
		Logger.log('Nothing');
		// When it's not done yet, go!

		// Set Infromation
		setInformation(sheet, row);
		// Convert Date
		convertDate(sheet, row);
	}
}

global.setInformation = (sheet, row) => {
	var ACCESS_TOKEN = scriptProperties.getProperty("instagram_access_token");

	var URL = sheet.getRange(row, 3).getValue();

	var urlSplits = URL.split("/");
	var SHORT_CODE = urlSplits[4];

	//Endpoint url to fetch photos information,
	var url = 'https://api.instagram.com/v1/media/shortcode/'+SHORT_CODE+'?access_token='+ACCESS_TOKEN
	Logger.log(url);

	//let us fetch the details from API. This will give you the details of photos and URL
	var response = UrlFetchApp.fetch(url).getContentText();
	Logger.log(response);

	//pase the JSON string data to JSON
	var responseObj = JSON.parse(response);

	//get photo data
	var photoData = responseObj.data;

	var name = photoData.location.name;
	var latitude = photoData.location.latitude;
	var longitude = photoData.location.longitude;
	var tagString = getTagString(photoData.tags);
	Logger.log('2-----' + tagString);

	sheet.getRange(row, 6).setValue(name);
	sheet.getRange(row, 7).setValue(latitude);
	sheet.getRange(row, 8).setValue(longitude);
	sheet.getRange(row, 12).setValue(tagString);

	Logger.log(name);
	//Logger.log('2-----' + tagString);

	// Set Address from latitude and longitude
	setAddress(sheet, row, latitude, longitude);
}

/* Set Address from geo location */
global.setAddress = (sheet, row, latitude, longitude) => {
	var address = MapsUtil.getStreetAddress(latitude, longitude);
	Logger.log(address);
	sheet.getRange(row, 9).setValue(address);

	var addressSplits = address.split(",");
	var country = addressSplits.pop();
	country = country.replace(/^\s+|\s+$/g, "");
	Logger.log(country);
	sheet.getRange(row, 10).setValue(country);
}

/* Get string from array */
global.getTagString = (tags) => {
	Logger.log(tags);

	var tagString = "";

	var len = tags.length;
	Logger.log(len);

	for(var i = 0; i < len; i ++) {
		tagString += tags[i];
		if(i < len - 1) {
			tagString += ",";
		}
		Logger.log(tagString);

	}
	return tagString;
}

/* Convert Date from Instagram format to Calendar format */
global.convertDate = (sheet, row) => {
	var DATE = sheet.getRange(row, 1).getValue();
	Logger.log(DATE);

	var dateSplits = DATE.split(" ");
	var mString = dateSplits[0]; // month
	var dString = dateSplits[1]; // date + ,
	var yString = dateSplits[2]; // year

	Logger.log(mString);
	Logger.log(dString);
	Logger.log(yString);

	var mNum = Month.getNumber(mString);
	Logger.log(mNum);

	var dNum = dString.split(",");
	Logger.log(dNum[0]);

	var ddd = mNum + "/" + dNum[0] + "/" + yString;
	Logger.log(ddd);

	sheet.getRange(row, 5).setValue(ddd);
}



