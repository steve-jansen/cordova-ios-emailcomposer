
/**
  * @static
  *
  * A Cordova v2.0.0 compatible plugin for iOS devices to 
  * display the Mail.app new message composer view via the
  * iOS MFMailComposeViewController type in the Message UI framework.
  */
var EmailComposer = {
  /**
    * Displays the Mail.app composer view using an optional array of arguments for the
    * view such as recipients, subject, body, and attachments.
    *
    * **NOTE: ** while safe to call this method multiple times, subsequent invokations of the
    * Mail.app composer view will be ignored by iOS until the first view is closed by the user.
    * Consider using showEmailComposerWithCB to serialize display of multiple composer windows.
    *
    * @param {Object}   [map]        An argument map of details about the email message.  Optional.
    * @param {String}   map.to       The to recipients line, comma separated.  Optional.
    * @param {String}   map.cc       The carbon copy recipients line, comma separated. Optional.
    * @param {String}   map.bcc      The blind carbon copy recipients line, comma separated.  Optional.
    * @param {String}   map.from     The profile email address to use for sending.  Optional.
    * @param {String}   map.subject  The subject line.  Optional.
    * @param {String}   map.body     The email body.  Optional.
    * @param {Boolean}  map.isHtml   Flag if the email body is HTML markup or plain text.  Defaults to false.
    * @param {Object[]} attachments           An array of arguments maps describing file attachments for the message. Optional.
    * @param {String}   attachments.mimeType  The well known mime type of the file attachment to create.  Required when the data property is non-null.  Ignored when the data property is null.
    * @param {String}   attachments.name      The filename to display for the attachment in the mail message.
    *                                         Not related to the actual filename on disk, if any. Required for each attachment.
    * @param {String}   attachments.data      File contents serialized as a string. Allows creation of attachments in memory.  Optional.
    * @param {Number}   attachments.encoding  The encoding type for the data property. Required when the data property is non-null.  Must be a value in `EmailComposer.EncodingType`.
    * @param {String}   attachments.filePath  The file system path for a file attach to a message.
    *                                         Ignored when the data property is non-null.
    *                                         The name property and the filePath property may be different values.
    * @param {function} [onSuccess] Optional; the callback to notify upon successful completion of the mail composer view;
    *                                 sends a single parameter of type ComposeResult
    * @param {function} [onError] Optional; the callback to notify upon error in the mail composer view; 
    *                                sends a single parameter of type string containing the CDVPluginResult value
    *
    * @returns {object}
    * Returns the actual argument map passed to the native iOS plugin code.  Useful for instrumenting what
    * would have been sent to the iOS mail composer when developing in a desktop browser.
    *
    * @example
    * EmailComposer.show({ 
    *   to: 'to@example.com',
    *   cc: 'cc@example.com',
    *   bcc: 'bcc@example.com',
    *   subject: 'Example email message',
    *   body: '<h1>Hello, world!</h1>',
    *   isHtml: true,
    *   attachments: [
    *     // attach a HTML file using a UTF-8 encoded string
    *     {
    *       mimeType: 'text/html',
    *       encoding: "UTF8",
    *       data: '<html><body><h1>Hello, World!</h1></body></html>',
    *       name: 'demo.html'
    *     },
    *     // attach a base-64 encoding of http://incubator.apache.org/cordova/images/cordova_128.png
    *     {
    *       mimeType: 'text/png',
    *       encoding: "Base64",
    *       data: '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)',
    *       name: 'cordova.png'
    *     }
    *     // attach a file using a hypothetical file path
    *     //,{ filePath: './path/to/your-file.jpg' }
    *   ],
    *   onSuccess: function (winParam) { 
    *     console.log('EmailComposer onSuccess - return code ' + winParam.toString());
    *   },
    *   onError: function (error) {
    *     console.log('EmailComposer onError - ' + error.toString()); }
    *   }
    * });
    */
  show: function show(map) {
    var args,
        onSuccessCallback,
        onErrorCallback;

    if (map != null) {
      args = EmailComposer.sanitize(map);
      onSuccessCallback = (typeof(map.onSuccess) === "function") ? map.onSuccess : undefined;
      onErrorCallback = (typeof(map.onError) === "function") ? map.onError : undefined;
    }
    
    if (cordova != null && typeof(cordova.exec) === "function") {
      cordova.exec(onSuccessCallback, onErrorCallback, "EmailComposer", "show", [args]);
    }

    return args;
  },

 /**
   * @static
   * @private
   *
   * Sanitizes the argument map before passing to the iOS plugin.  This also ensures
   * the expected argument keys exist for Objective-C key-value-coding.
   *
   * @param {Arguments} args an arguments instance to convert to an EmailMessage instance
   * @returns {object}
   */
  sanitize: function normalize(map) {
    var newMap = {},
        newAttachments = [],
        attachment,
        i,
        length;

      if (null == map)
        return null;

      newMap = {
        to: map.to,
        cc: map.cc,
        bcc: map.bcc,
        from: map.from,
        subject: map.subject,
        body: map.body,
        isHtml: map.isHtml,
        attachments: JSON.stringify([])
      };

     if (map.attachments && Array.isArray(map.attachments) && map.attachments.length > 0) {
      for(i = 0, length = map.attachments.length; i < length; i++) {
        attachment = map.attachments[i];
        newAttachments.push({
          mimeType: attachment.mimeType,
          name: attachment.name,
          data: attachment.data,
          encoding: EmailComposer.translateEncoding(attachment.encoding),
          filePath: attachment.filePath
        });
      }

      newMap.attachments = JSON.stringify(newAttachments);
    }

    return newMap;
  },

 /**
   * @static
   * @private
   *
   * Transforms string arguments for the encoding into a  `EncodingType` value
   *
   * @param a number or string value representing the encoding
   * @returns {number}
   */
  translateEncoding: function(encoding) {
    var value;

    if (!encoding) {
      return encoding;
    }

    if (typeof(encoding) === "number") {
      switch(encoding) {
        case EmailComposer.EncodingType.Base64:
        case EmailComposer.EncodingType.ASCII:
        case EmailComposer.EncodingType.UTF8:
        case EmailComposer.EncodingType.UTF16:
          value = encoding;
          break;
        default:
          value = null;
          break;
      }
    }
    else if (typeof(encoding) === "string") {
      switch(encoding.trim().toLowerCase()) {
        case "base64":
          value = EmailComposer.EncodingType.Base64;
          break;
        case "ascii":
          value = EmailComposer.EncodingType.ASCII;
          break;
        case "utf-8":
        case "utf8":
          value = EmailComposer.EncodingType.UTF8;
          break;
        case "utf-16":
        case "utf16":
        case "unicode":
          value = EmailComposer.EncodingType.UTF16;
          break;
        default:
          value = null;
          break;
      }
    }

    return value;
   },

  /**
    * An enum of possible return codes passed as the only argument to the EmailMessage#onSucess callback.
    * All values map to the iOS SDK MFMailComposeResult enum values */
  ComposeResult: Object.freeze({
    /** Per Apple's iOS SDK, "the email message was saved in the user’s Drafts folder." */
    Cancelled: 0,

    /** Per Apple's iOS SDK, "the user pressed the cancel button in the EmailComposer view and elected to  save the message as a draft." */
    Saved: 1,

    /** Per Apple's iOS SDK, "the email message was queued in the user’s outbox. It is ready to send the next time the user connects to email." */
    Sent: 2,

    /** Per Apple's iOS SDK, "the email message was not saved or queued, possibly due to an error." */
    Failed: 3,

    /** An unknown MFMailComposeResult was returned */
    Unknown: 4
  }),

  /**
  * An enum of possible encoding types for window.plugins.emailComposer.EmailAttachment#data.
  * All values except Base64 map to the iOS SDK NSStringEncoding enum values */
  EncodingType: Object.freeze({
    /** A base64 encoded string representation of a memory stream.  Useful for attaching binary files, such as image files */
    Base64: 0,
    
    /** A string using ASCII text encoding.  Useful for attaching ASCII text files. */
    ASCII: 1,
    
    /** A string using ASCII text encoding.  Useful for attaching UTF-8 text files, such as most HTML documents created in memory. */
    UTF8: 4,
    
    /** A string using ASCII text encoding.  Useful for attaching UTF-16 text files, such as most HTML documents created in memory.
      * Equivalent to Unicode encoding on iOS devices*/
    UTF16: 10
  })
};

// detect if we are wrapped in a cordova.define call
if (module) {
  module.exports = EmailComposer;
}
