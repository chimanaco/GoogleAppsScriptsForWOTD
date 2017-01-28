export default class GASMail {
  /**
   * send
   * @param { string } strTo to
   * @param { string } strSubject subject
   * @param { string } strBody body
   * @param { object } objAttachments
   */
  static send(strTo, strSubject, strBody, objAttachments) {
    Logger.log(`MailApp() send=, ${strTo}`);
    Logger.log(`MailApp() send=, ${strSubject}`);
    Logger.log(`MailApp() send=, ${strBody}`);
    Logger.log(`MailApp() send=, ${objAttachments}`);

    MailApp.sendEmail({
      to: strTo,
      subject: strSubject,
      body: strBody,
      attachments: objAttachments,
    });
    Logger.log(`MailApp() send Done`);
  }
};
