export default class GASS3 {
  /**
   * Get S3 Instance
   * @param {string} awsAccesskeyId string
   * @param {string} awsSecretKey string
   */
  static getS3Instance(awsAccesskeyId, awsSecretKey) {
    var s3 = S3.getInstance(awsAccesskeyId, awsSecretKey);
    return s3;
  }

  /**
   * Get S3 Instance
   * @param {string} s3 string
   * @param {string} bucket string
   * @param {string} path string
   */
  static getS3Object(s3, bucket, path) {
    var s3Object = s3.getObject(bucket, path);
    return s3Object;
  }
};
