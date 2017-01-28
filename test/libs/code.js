import chai from 'chai';
import hello from '../../dev/Hello';
import Month from '../../dev/libs/util/Month';
import StringUtil from '../../dev/libs/util/StringUtil';
import InstagramUtil from '../../dev/libs/GAS/Instagram/GASInstagram';


var should = chai.should();

describe('hello.js', () => {
  context('echo', () => {
    it('should return Hello yamamoto when the value is yamamoto', () => {
      hello.testFunc('yamamoto').should.equal('Hello yamamoto')
    });
  });
});

describe('Month.js', () => {
  context('echo', () => {
    it('should return 1 when the value is January', () => {
      Month.getNumber('January').should.equal(1)
    });
    it('should return 2 when the value is February', () => {
      Month.getNumber('February').should.equal(2)
    });
  });
});

describe('StringUtil.js', () => {
  context('echo', () => {
    it('should return https://instagram.com/p/BPjgsG2AOh_/ when the value is <https://instagram.com/p/BPjgsG2AOh_/>', () => {
      StringUtil.removeAngleBrackets('<https://instagram.com/p/BPjgsG2AOh_/>').should.equal('https://instagram.com/p/BPjgsG2AOh_/')
    });
  });
});


describe('InstagramUtil.js', () => {
  context('echo', () => {
    it('should return shortcode endpoint when the url and access token provided', () => {
      InstagramUtil.getEndPoint('https://www.instagram.com/p/BOs366pgkFD/', 'test_token').should.equal('https://api.instagram.com/v1/media/shortcode/BOs366pgkFD?access_token=test_token')
    });

    it('should return 12/31/2016 when the date is December 31, 2016 at 04:10PM', () => {
      InstagramUtil.getConvertedDate('December 31, 2016 at 04:10PM').should.equal('12/31/2016')
    });

    it('should return https://www.instagram.com/p/BOs366pgkFD/ for the link in data when the data from Instagram provided', () => {
      InstagramUtil.getDataFromResponse('{"data": {"link": "https://www.instagram.com/p/BOs366pgkFD/", "user_has_liked": false, "user": {"full_name": "Washroom of the day", "id": "1971473865", "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/11325046_475644789271253_2006666604_a.jpg", "username": "washroomoftheday"}, "comments": {"count": 1}, "id": "1417753923976053059_1971473865", "likes": {"count": 17}, "location": {"longitude": 135.23886917728, "id": 283238495132319, "latitude": 34.711767866761, "name": "\u795e\u6238\u516d\u7532\u30dc\u30a6\u30eb"}, "filter": "Normal", "type": "image", "users_in_photo": [], "attribution": null, "images": {"standard_resolution": {"url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/15802294_134033427092780_3101250757496668160_n.jpg?ig_cache_key=MTQxNzc1MzkyMzk3NjA1MzA1OQ%3D%3D.2", "height": 640, "width": 640}, "low_resolution": {"url": "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/15802294_134033427092780_3101250757496668160_n.jpg?ig_cache_key=MTQxNzc1MzkyMzk3NjA1MzA1OQ%3D%3D.2", "height": 320, "width": 320}, "thumbnail": {"url": "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/15802294_134033427092780_3101250757496668160_n.jpg?ig_cache_key=MTQxNzc1MzkyMzk3NjA1MzA1OQ%3D%3D.2", "height": 150, "width": 150}}, "caption": {"text": "#washroomoftheday from #kobe Japan. \u4eca\u65e5\u306e\u30c8\u30a4\u30ec\u3002from @dinifujimoto #washroomsign #bathroomsign #toiletsign", "from": {"full_name": "Washroom of the day", "id": "1971473865", "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/11325046_475644789271253_2006666604_a.jpg", "username": "washroomoftheday"}, "id": "17868525484036127", "created_time": "1483229459"}, "tags": ["washroomsign", "toiletsign", "washroomoftheday", "bathroomsign", "kobe"], "created_time": "1483229459"}, "meta": {"code": 200}}')
        .link.should.equal('https://www.instagram.com/p/BOs366pgkFD/')
    });

    it('should return tags as string when the tags provided as array', () => {
      InstagramUtil.getTagsAsString(['kobe', 'washroomoftheday', 'bathroomsign', 'toiletsign', 'washroomsign']).should.equal("kobe,washroomoftheday,bathroomsign,toiletsign,washroomsign")
    });
  });
});
