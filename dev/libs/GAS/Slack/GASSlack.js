export default class GASSlack {
  /**
   * Get Image url from Slack post
   * @param { string } apiToken
   * @param { string } channel
   * @return { string } urlString
   */
  static getImageURL(apiToken, channel, count) {
    const url = 'https://slack.com/api/channels.history?token=' +
      apiToken + '&channel=' +
      channel + '&count=' +
      count;
    return url;
  }
}
