export default class MailUtil{
  constructor() {
  }

  /**
   * send
   * @param { } nothing
   */
  static send (strTo, strSubject, strBody, objAttachments) {
    MailApp.sendEmail({
      to: strTo,
      subject: strSubject,
      body: strBody,
      attachments: objAttachments
    });
  }
};
