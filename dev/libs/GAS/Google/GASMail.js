export default class GASMail {
  /**
   * send
   * @param { string } strTo to
   * @param { string } strSubject subject
   * @param { string } strBody body
   * @param { object } objAttachments
   */
  static send(strTo, strSubject, strBody, objAttachments) {
    MailApp.sendEmail({
      to: strTo,
      subject: strSubject,
      body: strBody,
      attachments: objAttachments,
    });
  }
};
