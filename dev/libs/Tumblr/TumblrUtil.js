export default class TumblrUtil {
    constructor() {
    }

    /**
     * Get Tumblr service
     * @param { string } consumerKey key
     * @param { string } consumerSecret secret
     */
    static getTumblrService (consumerKey, consumerSecret) {
        return OAuth1.createService('tumblr')
            .setAccessTokenUrl('http://www.tumblr.com/oauth/access_token')
            .setRequestTokenUrl('http://www.tumblr.com/oauth/request_token')
            .setAuthorizationUrl('http://www.tumblr.com/oauth/authorize')
            .setConsumerKey(consumerKey)
            .setConsumerSecret(consumerSecret)
            .setCallbackFunction('_authCallback')
            .setPropertyStore(PropertiesService.getUserProperties());
    }

    // TODO: test this
    _authCallback (request) {
        const service = getTumblrService();
        const isAuthorized = service.handleCallback(request);
        if (isAuthorized) {
            return HtmlService.createHtmlOutput('Success! You can close this tab.');
        } else {
            return HtmlService.createHtmlOutput('Denied. You can close this tab');
        }
    }
};
