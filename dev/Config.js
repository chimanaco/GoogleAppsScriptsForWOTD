import GASSpreadsheets from './libs/GAS/Google/GASSpreadsheets';

const TAG = 'Config ';
const scriptProperties = PropertiesService.getScriptProperties();
const spreadSheetId = scriptProperties.getProperty('spreadsheet_id');

// SpreadSheet
const spreadSheet = GASSpreadsheets.getSpreadSheetById(spreadSheetId);
Logger.log(`${TAG}, speradsheet=, ${spreadSheet}`);

const sheetNameInstagram = scriptProperties.getProperty('sheet_instagram');
const sheetInstagram = GASSpreadsheets.getSheetByName(spreadSheet, sheetNameInstagram);
const sheetNameCopy = scriptProperties.getProperty('sheet_copy');
const sheetCopy = GASSpreadsheets.getSheetByName(spreadSheet, sheetNameCopy);
const sheetNameOthers = scriptProperties.getProperty('sheet_others');
const sheetOthers = GASSpreadsheets.getSheetByName(spreadSheet, sheetNameOthers);

// Slack
// Configuration: Obtain Slack web API token at https://api.slack.com/web
const slackApiToken = scriptProperties.getProperty('slack_api_token');
if (!slackApiToken) {
  throw 'You should set "slack_api_token" property from [File] > [Project properties] > [Script properties]';
}
const slackChannel = scriptProperties.getProperty('slack_channel');
Logger.log(`${TAG}, setConstsValues() CHANNEL=, ${slackChannel}`);

// Mail
const mailTo = scriptProperties.getProperty('mail_to');
const mailSubject = 'You got an Instagram Photo for WOTD';
const mailBody = 'Have a good one!';
const mailImgName = 'wotd.jpg';

// Instagram
const instagramAccessToken = scriptProperties.getProperty('instagram_access_token');

const tumblrConsumerKey = scriptProperties.getProperty('tumblr_consumer_key');
const tumblrConsumerSecret = scriptProperties.getProperty('tumblr_consumer_secret');
const tumblrPostUrl = 'https://api.tumblr.com/v2/blog/washroomoftheday.tumblr.com/post';

const appState = {
  spreadSheet: {
    scriptProperties,
    spreadSheetId,
    spreadSheet: slackChannel,
    sheet: {
      instagram: sheetInstagram,
      copy: sheetCopy,
      others: sheetOthers,
    },
  },
  slack: {
    apiToken: slackApiToken,
    channel: slackChannel,
  },
  instagram: {
    accesToken: instagramAccessToken,
  },
  tumblr: {
    consumerKey: tumblrConsumerKey,
    consumerSecret: tumblrConsumerSecret,
    postUrl: tumblrPostUrl,
  },
  mail: {
    to: mailTo,
    subject: mailSubject,
    body: mailBody,
    imgName: mailImgName,
  },
  cell: {
    others: {
      date: 'A1',
    },
  },
  columns: {
    instagram: {
      orgDate: 1,
      url: 3,
      source: 4,
      date: 5,
      name: 6,
      latitude: 7,
      longitude: 8,
      address: 9,
      country: 10,
      city: 11,
      tags: 12,
      done: 13,
      userInstagram: 14,
      fbGroup: 15,
    },
    copy: {
      date: 2,
      name: 3,
      lat: 4,
      lon: 5,
      address: 6,
      country: 7,
      city: 8,
      userInstagram: 9,
    },
    others: {
      date: 1,
      url: 2,
      image: 3,
    },
  },
};

export default appState;

