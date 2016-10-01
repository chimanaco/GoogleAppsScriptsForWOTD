const scriptProperties = PropertiesService.getScriptProperties();
const CONSUMER_KEY = scriptProperties.getProperty("tumblr_consumer_key");
const CONSUMER_SECRET = scriptProperties.getProperty("tumblr_consumer_secret");

/*
 * From Here
 *
*/
global.startTumblr = (sheet, row) => {
  var sheet = getSheet();
  var row = sheet.getLastRow();
  Logger.log(row);
  
  var isDone = sheet.getRange(row, 14).getValue();
  Logger.log('checkyou=' + isDone);
    
  var firstRow = checkIfDone(sheet, row);
  Logger.log("First Row = " + firstRow);
  goPosts(sheet, firstRow, row);
}

global.goPosts = (sheet, firstRow, lastRow) => {
  for (var i = firstRow; i < lastRow + 1; i ++){
    Logger.log("Post:" + i);
    tumblrPost(sheet, i);
  }
}

global.tumblrPost = (sheet, row) => {
  Logger.log(row);
    
  var service = getTumblrService();
  var name = sheet.getRange(row, 6).getValue();
  var country = sheet.getRange(row, 10).getValue();
  var city = sheet.getRange(row, 11).getValue();
  var caption = name + "\n" + city + " " + country;
  var source = sheet.getRange(row, 4).getValue();
  var tags = sheet.getRange(row, 12).getValue();
  
  var from = sheet.getRange(row, 14).getValue();
  var via = sheet.getRange(row, 15).getValue();
  
  Logger.log('from' + from);  
  Logger.log('via' + via);

  if(from != '#N/A') {
    Logger.log('From exists' + from);
    // Add Instagram link text
    caption += getInstagramLinkText(from);
  } else if (via != '#N/A') {
    Logger.log('Via Exists' + via);
    // Add FB Group link text
    caption += getFBGroupLinkText(via);  
  }
  
  var BLOG_POST_URL = "https://api.tumblr.com/v2/blog/washroomoftheday.tumblr.com/post";
  var options =
  {
    "oAuthServiceName" : "tumblr",
    "oAuthUseToken" : "always",
    "method" : "POST",
    "payload" : {
      "type": "photo",
      "caption": caption,
      "source": source,
      "tags": tags
    }
  };
      
  if (service.hasAccess()) {
    var response = service.fetch(BLOG_POST_URL, options);
    Logger.log(response);  
    setDoneNumber(sheet, row);
    
    var date = sheet.getRange(row, 5).getValue();
    var lat = sheet.getRange(row, 7).getValue();
    var lon = sheet.getRange(row, 8).getValue();
    var address = sheet.getRange(row, 9).getValue();
    var insta = sheet.getRange(row, 14).getValue();
    
    copyCell(date, name, lat, lon, address, country, city, insta);
    
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Please visit the following URL and then re-run the script: ' + authorizationUrl);
  }
}

/*
 * Set Done Number as it's done.
 *
*/
global.setDoneNumber = (sheet, row) => {
  sheet.getRange(row, 13).setValue(1);
  Logger.log('Set Done Number on' + row);  
}

global.copyCell = (date, name, lat, lon, address, country, city, insta) => {
  var sheet = getWashromSheet();
  var row = sheet.getLastRow() + 1;
  Logger.log(row);
  
  sheet.getRange(row, 2).setValue(date);
  sheet.getRange(row, 3).setValue(name);
  sheet.getRange(row, 4).setValue(lat);
  sheet.getRange(row, 5).setValue(lon);
  sheet.getRange(row, 6).setValue(address);
  sheet.getRange(row, 7).setValue(country);
  sheet.getRange(row, 8).setValue(city);
  sheet.getRange(row, 9).setValue(insta);
  Logger.log('Set Done Number on' + row);  
}


global.getTumblrService = () => {
  return OAuth1.createService('tumblr')
      .setAccessTokenUrl('http://www.tumblr.com/oauth/access_token')
      .setRequestTokenUrl('http://www.tumblr.com/oauth/request_token')
      .setAuthorizationUrl('http://www.tumblr.com/oauth/authorize')
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties());
}

global.authCallback = (request) => {
  var service = getTumblrService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

global.getSheet = () => {
  var SPREADSHEET_ID = scriptProperties.getProperty("spreadsheet_id");

  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(spreadsheet);
  
  var sheet = spreadsheet.getSheetByName('Instagram');
  Logger.log(sheet);
  
  return sheet;
}

global.getWashromSheet = () => {
  var SPREADSHEET_ID = scriptProperties.getProperty("spreadsheet_id");

  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(spreadsheet);
  
  var sheet = spreadsheet.getSheetByName('Washroom');
  Logger.log(sheet);
  
  return sheet;
}

global.checkIfDone = (sheet, row) => {
  var rowToStart = 0;
  
  for (var i = row; i > 0; i --){
    var isDone = checkCell(sheet, i);
    if(isDone) {
      rowToStart = i + 1;
      Logger.log("IsDone = " + isDone);
      break;
    }
  }
  
  return rowToStart;
}

global.checkCell = (sheet, row) => {
  Logger.log('Row=' + row);
  var isDone = sheet.getRange(row, 13).getValue();
  Logger.log('checkyou=' + isDone);
  
  var isExist;
  
  if(isDone == '') {
    Logger.log('Nothing');
    isExist = false;
  } else {
    Logger.log('Exists');
    isExist = true;
  }
  return isExist;
}

global.getInstagramLinkText = (from) => {
  Logger.log('from=' + from);
  var text = "\n"; 
  var userName = from.substr(1);
  text += "from "; 
  text += '<a href="https://www.instagram.com/' + userName + '/">'
  text += from;
  text += '</a>'
  return text;
}

global.getFBGroupLinkText = (via) => {
  Logger.log('Via=' + via);
  var text = "\n"; 
  text += "via "; 
  text += '<a href="https://www.facebook.com/groups/washroom.of.the.day/">'
  text += via;
  text += '</a>'
  return text;
}

