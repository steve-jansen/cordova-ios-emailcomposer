"use strict";

// shim to work in 1.5 and 1.6
window.Cordova = window.Cordova || cordova;

window.plugins = window.plugins || {};

window.plugins.emailComposer = {
  /**
    * @static
    * Backwards compatability with earlier versions of the EmailComposer plugin from the windows.plugin namespace,
    * which is also used by the Android plugin
    *
    * @deprecated Use EmailComposer.show() with an object argument map of the message properties and callbacks.

    * Displays the Mail.app composer view using an optional array of arguments for the
    * view such as recipients, subject, body, and attachments.
    *
    * @param {function} callback The function callback to invoke upon completion of the MFMailComposeView, either successful or not.
    * @param {string} [subject] Legacy email subject for the message. Optional.
    * @param {string} [body] Legacy email body for the message. Optional.
    * @param {string} [toRecipients] Legacy email body for the message. Optional.
    * @param {string} [ccRecipients] Legacy email body for the message. Optional.
    * @param {string} [bccRecipients] Legacy email body for the message. Optional.
    * @param {string} [IsHtml] Legacy email body for the message. Optional.
    * @param {string[]} [attachments] An array of file system paths of files to attach to the email. Optional.
    */
  showEmailComposer: function showEmailComposer(subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments) {
    return window.plugins.emailComposer.showEmailComposerWithCallback(null, subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments);
  },

  showEmailComposerWithCallback: function showEmailComposerWithCallback(callback, subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments) {
    var newAttachments = [],
        i,
        length;

    if (console && typeof(console.warn) === "function")
      console.warn("showEmailComposer has been deprecated; use cordova.require('plugins.ios.EmailComposer').show() instead");

    if (null != attachments && Array.isArray(attachments))
    {
        for(i = 0, length = attachments.length; i < length; i++) {
          newAttachments.push({ filePath: attachments[i] });
        }
    }

    return EmailComposer.show({
            to: toRecipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject: subject,
            body: body,
            isHtml: isHTML,
            attachments: newAttachments,
            onSuccess: callback,
            onError: callback
          });
  }
}; 