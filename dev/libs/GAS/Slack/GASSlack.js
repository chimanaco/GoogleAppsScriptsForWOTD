export default class GASSlack {
  /**
   * Get Image url from Slack post
   * @param { string } apiToken
   * @param { string } channel
   * @return { string } urlString
   */
  static getImageURL(apiToken, channel) {
    const COUNT = 1;
    const URL = 'https://slack.com/api/channels.history?token=' +
      apiToken + '&channel=' +
      //CHANNEL + "&oldest=" +
      //this.START_TS + "&latest=" +
      //this.END_TS + "&count=" +
      channel + '&count=' +
      COUNT + '&unreads=1&pretty=1';
    // const URL = `https://slack.com/api/channels.history?token=,
    //   ${config.SLACK_API_TOKEN}, &channel=,
    //   //CHANNEL + "&oldest=" +
    //   //this.START_TS + "&latest=" +
    //   //this.END_TS + "&count=" +
    //   ${config.SLACK_CHANNEL}, &count=,
    //   ${COUNT}, &unreads=1&pretty=1`;

    Logger.log(URL);

    const response = UrlFetchApp.fetch(URL).getContentText();
    Logger.log(response);

    const responseObj = JSON.parse(response);
    Logger.log(responseObj);

    //get photo data
    let urlString = responseObj.messages[0].text;
    Logger.log(urlString);
    urlString = urlString.replace(/</g, '');
    urlString = urlString.replace(/>/g, '');
    Logger.log(urlString);

    return urlString;
  }
}
