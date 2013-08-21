Cordova EmailComposer Plugin for iOS
-------------------------------------

A Cordova plugin for iOS devices to create e-mail messages via Apple's Mail.app compose view.

### Requirements
* Supports Cordova 2.7 and higher;
* Tested against Cordova 3.0;
* Cordova <2.7 support is possible with manual editing of the plist/config settings for plugins and optionally enabling ARC

### Installation

The easy way via the cordova-cli:

    sudo npm install -g cordova
    cordova create ~/MyApp MyApp
    cd ~/MyApp
    cordova platform add ios
    cordova plugin add emailcomposer # using the http://plugins.cordova.io registry
    cordova build


The hard way via manual labor:

* Add MessageUI.framework to your project
* Add EmailComposer.h, EmailComposer.m, NSData+Base64.h, and NSData+Base64.m to your project
* Copy the EmailComposer.js file to your www directory
* Include EmailComposer.js as a `<script>` in your html page
* Modify the `Cordova.plist` Plugins section to include: key EmailComposer value EmailComposer


### Example Implementation

An example of using this plugin will be copied by the cordova-cli to your Xcode project
as `www/examples/EmailComposer.html`.  The example depends on some of the files used by
the Cordova Hello, World example.  Add an href like below to your `www/index.html` source
to view the example within your app.

    <a href="examples/EmailComposer.html">Email Composer</a>


### Usage

Using `cordova.require`:

    var emailComposer = cordova.require('emailcomposer.EmailComposer')

    /* alternatively exists in global scope as EmailComposer if you embed via a script tag */

    emailComposer.show({ 
      to: 'to@example.com',
      cc: 'cc@example.com',
      bcc: 'bcc@example.com',
      subject: 'Example email message',
      body: '<h1>Hello, world!</h1>',
      isHtml: true,
      attachments: [
       // attach a HTML file using a UTF-8 encoded string
       {
         mimeType: 'text/html',
         encoding: 'UTF-8',
         data: '<html><body><h1>Hello, World!</h1></body></html>',
         name: 'demo.html'
       },
       // attach a base-64 encoded veresion of of http://cordova.apache.org/favicon.ico
       {
          mimeType: 'text/png',
          encoding: 'Base64',
          data: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS4xLjIiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K5JKPKQAAAtpJREFUOBFNU0toE1EUPTOZTJI2qbG0qUnwg1IFtSBI967cCBHcSsGFgktdC125EvwVLKi0FApaCChuRMSFqAitCNrGJE1DadpSYz5OvpPJ5Od5007xwc1998475513743U6/Uk7K1Op6O0Wq2pdrvt597odrugh/A0hcdk+luhUKhgY0Ryf5HsmizLNz0eN9qtNvRGA8xBdTohyxJjQ8TrBEzaIOk/BQNk3+YHL1WAKiyguL1Wr1tK3C6XteeZ01SRFCSy+Nlb07zdG0umcPvOXTyde8lbZbjcbjyYnsG5CxG8fvsBBJKs+8wG2QouMvFOJB9Mz+JnLA6P24UBnxcNo4nk2jpiiVWEQ2G8j87ApSqo643rgUBg1lJgGMaUAK/EkyhVaxg7eQLhoUEoThX9JBk54MVh/wDSm1uYj75Bv9eHRqNxL5PJTFpF1DRN8fX3oVKp4GhwGB6/H50eoO3sIBgYRpdvr/v8cCeS8KgOFHNZZLNZlfVTLQWKoixDkuElyeLXJdT7vGiHw/j+7QdezC9gCw6MX76Ezx+/QJYkVKiShU6y0MuWAjKlzJYJp+JAIZdDJl+AT3ZgM7OJYqGA4Jkx/C5X4XEpvMSDaq0K0zRTAmcRkCnZZutEm4p6A3MPn8Ahel/SoJstbEVf4dNCFIPBQ/ByRqpU0Gw2UyzbhkVAOSkywuGQMT5+HgOsuEtRIJ06jl63B4nqmuzGwZEAnE7FIhCYSCRSsggIXmcnxLtw4+oViNluc4Q7HCbbi4ES34tayRoyHknTdgdpdHQ0S4KcUJBKrdXuP3q8XGZH/uTzyOXyKJXLeD4zF1uJr2ZFnfh26Lq+sU8gSZJaLpfTBmWyQLWlxaWczlpoWskk2GzyefH4r7+JRGKHZ4WS9MTEREUQWJPIpJv7Y7SztCM0EYvV3XX7I28w3qbFaBtUotsEKhN+2hCtjybmwwZzay07pzMSf+cSCcx/K8WXLZEV/swAAAAASUVORK5CYII=',
          name: 'cordova.png'
        }
        // attach a file using a hypothetical file path
        //,{ filePath: './path/to/your-file.jpg' }
      ],
      onSuccess: function (winParam) { 
        console.log('EmailComposer onSuccess - return code ' + winParam.toString());
      },
      onError: function (error) {
        console.log('EmailComposer onError - ' + error.toString());
      }
    });


### Deprecated Usage / Backwards Compatability

For backwards compatability with version 1.x of this plugin and the EmailComposerWithAttachments plug,
the following methods are avaialble on the window.plugins global object when
embedding both `EmailComposer.js` and `EmailComposer-Deprecated.js`

  <script src="EmailComposer.js" />
  <script src="EmailComposer-Deprecated.js" />
  <script>
      // TODO: handle device.ready and declare/assign subject, body, toRecipients, etc.

      window.plugins.emailComposer.showEmailComposer(subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments);

      window.plugins.emailComposer.showEmailComposerWithCallback(callback, subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments);

      // ... 
  </script>


### Credits

  - Created by Jesse MacFadyen on April 5th, 2010
  - Added Cordova 1.5 support by @RandyMcMillan on March 2012
  - Added support for optional file attachments by @steve-jansen on October 2012
  - Upgraded to the Cordova 2.1 `void:(CDVInvokedUrlCommand*)` signature by @steve-jansen on November 2012
  - Uses the outstanding NSData+Base64 implementation by Matt Gallagher on 2009/06/03
  - Integrated Guido Sabatini's detection of mime type for file attachments that use a file system path by @steve-jansen on June 2013


### Reporting Bugs / Request Features

Please create a GitHub issue to report a bug or request a feature @ https://github.com/steve-jansen/cordova-ios-emailcomposer/issues


### Contributing

I have yet to find a good workflow for running/testing changes to the plugin.

My less than ideal way today is to recreate a "Hello, World" Cordova project with
my plugin via:

    sudo npm install -g cordova
    ./develop.sh

The `develop.sh` shell script will use the cordova-cli to create a new project and add this plugin
to it.  It will then open the "HelloCordova" project in Xcode.  You can optionally symlink
the .m and .h plugin files, however, this can have side effects with commands like `git clean -fdx`.
It is not possible to symlink the 

JavaScript unit tests are run by opening [spec/spec.html](spec/spec.html) in Safari or Chrome

Objective-C unit tests require a faily complex setup process,
documented in [spec/ios/README.md](spec/ios/README.md).
