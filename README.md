# Google Apps Script for Washroom of the Day Update

## Instagram

Get Instagram information from Google Spreadsheets data with Instagram API.

## Tumblr

Post photos with captions to Tumbler from Google Spreadsheets data with Tumblr API.

## Slack

Get new Photos on specified Slack channel and send it to specified email address with Slack API.

## Directory

### dev/
You will write your es6 code here.

### src/
Your es6 code will convert and publish here.

## target/
for Webpack (not used now)
Bundled script to upload to Google Docs will be here.

## Getting Started

$ sh setup.sh

* On your script, select `Developers console Project` in `Resources` Menu and 
 click `View Developer Console`. 
* Click `Credentials` on left menu.
* Click `Create credentials` on `credentials` and then select `Oauth Client ID`.
* Select `Other` in `application type`, click `Create`, input your app name and click `Create again`.
* You can download your credential json file by clicking download button from `OAuth 2.0 client IDs`.
* Move your credential json file into `credentials` directory in the project.

$ gapps auth ./credentials/{filename}.json

## Usage

### Develop (Watch + Test + Browserify + Upload)

$ npm run dev

### Upload to Google Drive

$ npm run upload

### Test

$ npm run test

## References

GitHub - tiagorg/gulp-es6-webpack-example: Sample setup with Gulp, Babel, Mocha and Webpack, including lazy loading
https://github.com/tiagorg/gulp-es6-webpack-example

Google Apps Scriptの開発をモダンに行う方法 - TECHNICA Speee engineer blog
http://technica-blog.jp/entry/2016/04/28/190236

Google Apps Scriptをローカルで開発する - Qiita
http://qiita.com/ttyokoyama/items/a4edfdcfcad56d664522

node-google-apps-script
https://www.npmjs.com/package/node-google-apps-script

browserify と watchify で複数ファイルを個別にbundleする方法。たぶん最小構成のはず。 - Qiita
http://qiita.com/snjssk/items/b2e3e60659bee8a4e4e2#_reference-b1e24da25f60e1a9c687

Google Spreadsheet(Google Apps Script)からtumblrに投稿する方法 - Qiita
http://qiita.com/hidesuke/items/c9f7441342b4244c599c

API | Tumblr
https://www.tumblr.com/docs/en/api/v2#auth

Migrating from OAuthConfig to the OAuth1 library  |  Apps Script  |  Google Developers
https://developers.google.com/apps-script/migration/oauth-config

GitHub - googlesamples/apps-script-oauth1
https://github.com/googlesamples/apps-script-oauth1


