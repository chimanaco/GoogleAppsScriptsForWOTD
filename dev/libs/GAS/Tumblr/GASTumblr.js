import JsonUtil from '../../util/JsonUtil';

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
   * Get post from Tumblr
   * @param { Service } service
   * @param { string } url post url
   * @param { string } caption for post
   * @param { string } source img source
   * @param { string } tags for post
   */
  static getPhotoPostCaption(service, url, id) {
    const options =
      {
        oAuthServiceName: 'tumblr',
        oAuthUseToken: 'always',
        method: 'POST',
        payload: {
          id,
        },
      };
    Logger.log('GASTumblr getPhotoPost()');

    const response = service.fetch(url, options);
    const responseObj = JSON.parse(response);
    // get caption of the post
    const caption = responseObj.response.posts[0].caption;
    Logger.log(`GASTumblr getPhotoPost() responseObj.response.posts[0].caption=, ${caption}`);
    return caption;
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

  /**
   * Edit Tumblr Post
   * @param { Service } service
   * @param { string } url post url
   * @param { string } caption for post
   * @param { string } source img source
   * @param { string } tags for post
   */
  static getPost(service, url, caption) {
    const options =
      {
        oAuthServiceName: 'tumblr',
        oAuthUseToken: 'always',
        method: 'POST',
        payload: {
          type: 'photo',
          id: 163802505090,
          caption,
        },
      };
    Logger.log(`GASTumblr editPost() options=, ${options}`);

    const response = service.fetch(url, options);
    Logger.log(`GASTumblr editPost()100 response=, ${response}`);
  }

  /**
   * Edit Tumblr Post
   * @param { Service } service
   * @param { string } url post url
   * @param { string } caption for post
   * @param { string } source img source
   * @param { string } tags for post
   */
  static edipPost(service, url, id, caption) {
    const options =
      {
        oAuthServiceName: 'tumblr',
        oAuthUseToken: 'always',
        method: 'POST',
        payload: {
          type: 'photo',
          id,
          caption,
        },
      };
    // Logger.log(`GASTumblr editPost() options=, ${options}`);

    const response = service.fetch(url, options);
    Logger.log(`GASTumblr editPost() response=, ${response}`);
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
