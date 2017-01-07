export default class GASTumblr {
  /**
   * Get Tumblr service
   * @param { string } consumerKey key
   * @param { string } consumerSecret secret
   */
  static getTumblrService(consumerKey, consumerSecret) {
    return OAuth1.createService('tumblr')
      .setAccessTokenUrl('http://www.tumblr.com/oauth/access_token')
      .setRequestTokenUrl('http://www.tumblr.com/oauth/request_token')
      .setAuthorizationUrl('http://www.tumblr.com/oauth/authorize')
      .setConsumerKey(consumerKey)
      .setConsumerSecret(consumerSecret)
      .setCallbackFunction('_authCallback')
      .setPropertyStore(PropertiesService.getUserProperties());
  }

  /**
   * Post photo to Tumblr
   * @param { Service } service
   * @param { string } url post url
   * @param { string } caption for post
   * @param { string } source img source
   * @param { string } tags for post
   */
  static postPhoto(service, url, caption, source, tags) {
    const options =
      {
        oAuthServiceName: 'tumblr',
        oAuthUseToken: 'always',
        method: 'POST',
        payload: {
          type: 'photo',
          caption,
          source,
          tags,
        },
      };
    Logger.log(`GASTumblr postPhoto() options=, ${options}`);

    const response = service.fetch(url, options);
    Logger.log(`GASTumblr postPhoto() response=, ${response}`);
  }

  // TODO: test this
  _authCallback(request) {
    const service = getTumblrService();
    const isAuthorized = service.handleCallback(request);
    if (isAuthorized) {
      return HtmlService.createHtmlOutput('Success! You can close this tab.');
    } else {
      return HtmlService.createHtmlOutput('Denied. You can close this tab');
    }
  }
};
