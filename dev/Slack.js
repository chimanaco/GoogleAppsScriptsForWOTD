const scriptProperties = PropertiesService.getScriptProperties();

// Configuration: Obtain Slack web API token at https://api.slack.com/web
var API_TOKEN = PropertiesService.getScriptProperties().getProperty('slack_api_token');
if (!API_TOKEN) {
    throw 'You should set "slack_api_token" property from [File] > [Project properties] > [Script properties]';
}

/*
 * From Here
 *
 */
global.Slack = () => {
  Logger.log("fetch");
  var SPREADSHEET_ID = scriptProperties.getProperty("spreadsheet_id");
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(spreadsheet);

  var sheet = spreadsheet.getSheetByName('others');
  Logger.log(sheet);
  
  // Get Time
  var date = sheet.getRange("A1").getValue();
  Logger.log(date);
  
  var START_TS = getStartTs(date);
  var END_TS = getEndTs(date);
  
  Logger.log(START_TS);
  Logger.log(END_TS);

  var CHANNEL = scriptProperties.getProperty("slack_channel");

  var COUNT = 1;
  var URL = "https://slack.com/api/channels.history?token=" +
    API_TOKEN + "&channel=" +
    //CHANNEL + "&oldest=" +
    //START_TS + "&latest=" +
    //END_TS + "&count=" +
    CHANNEL + "&count=" +
    COUNT + "&unreads=1&pretty=1";
    
  Logger.log(URL);
  
  var response = UrlFetchApp.fetch(URL).getContentText();  
  Logger.log(response);
  
  var responseObj = JSON.parse(response);    
  Logger.log(responseObj);
  
  //get photo data
  var urlString = responseObj.messages[0].text;
  Logger.log(urlString);
  urlString = urlString.replace( /</g , "" );
  urlString = urlString.replace( />/g , "" );
  Logger.log(urlString);  
  
  var row = sheet.getLastRow();
  Logger.log(row);
  
  // Get Name to test
  var name = sheet.getRange(row, 2).getValue();
  Logger.log(name);
  
  if(urlString == name) {
      Logger.log('Exists');
  } else {
      Logger.log('Nothing');
      // When it's not done yet, go!
      
      scrapeImage(sheet, row + 1, urlString);
      setInfoValue(sheet, row + 1, urlString);
  }  
}

global.scrapeImage = (sheet, row, url) => {
  //let us fetch the details from API. This will give you the details of photos and URL
  var response = UrlFetchApp.fetch(url).getContentText();  
  var myRegexp = /display_src": "([\s\S]*?)?ig_cache/i;
  
  var match = myRegexp.exec(response);
  Logger.log(match);
  
  var urlString = match[1];
  Logger.log(urlString);
  
  var stringVal = sheet.getRange(row, 3).setValue(urlString);
  
  // Send Mail
  sendMail(urlString);
}

global.setInfoValue = (sheet, row, urlString) => {
 sheet.getRange(row, 1).setValue(Date.now());
 sheet.getRange(row, 2).setValue(urlString);
}

global.getStartTs = (val) => {
   var start_date = new Date(val);
    start_date.setHours(0);
    start_date.setMinutes(0);
    start_date.setSeconds(0);
    start_date.setMilliseconds(0);
    var start_ts = start_date.getTime() /1000;
    return start_ts;
}

global.getEndTs = (val) => {
    var end_date = new Date(val);
    end_date.setHours(23);
    end_date.setMinutes(59);
    end_date.setSeconds(59);
    end_date.setMilliseconds(0);
    var end_ts = end_date.getTime() /1000;
    return end_ts;
}

global.sendMail = (imgPath) => {
  var strTo = PropertiesService.getScriptProperties().getProperty('mail_to');
  var strSubject = "You got an Instagram Photo for WOTD";
  var strBody = "Have a good one!";
  // Get An image
  var image = UrlFetchApp.fetch(imgPath);  
  
  MailApp.sendEmail({
    to: strTo,
    subject: strSubject,
    body: strBody,
    attachments: [image.getBlob().setName('wotd.jpg')]
  });
  
  // Gmail だと Mail Delivery Subsystem 飛んでくる
  /*
  GmailApp.sendEmail(
    strTo,
    strSubject,
    strBody,
    {
      from: strFrom,
      name: strSender
    }
  ); //MailAppではfromが設定できないとのこと
  */
}

function parse() {
    /*
  // 絵文字のせいかも
  var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
        '\ud7c9[\ude00-\udeff]',
        '[\u2600-\u27BF]'
  ];
  var ex = new RegExp(ranges.join('|'), 'g');
  title = title.replace(ex, ''); //ここで削除
  
  
  title = title.replace(/(^\s+)|(\s+$)/g, "");
  
  // preserve newlines, etc - use valid JSON
  title = title.replace(/\\n/g, "\\n")
  .replace(/\\'/g, "\\'")
  .replace(/\\"/g, '\\"')
  .replace(/\\&/g, "\\&")
  .replace(/\\r/g, "\\r")
  .replace(/\\t/g, "\\t")
  .replace(/\\b/g, "\\b")
  .replace(/\\f/g, "\\f");
 
  // remove non-printable and other non-valid JSON chars
  title = title.replace(/[\u0000-\u0019]+/g,""); 
  
  Logger.log(title);
  
  // TODO: パースができなくてエラーがおきる
  
  var responseObj = JSON.parse(title);    
  Logger.log(responseObj);
  */

}