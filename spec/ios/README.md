XCode Unit Tests for cordova-ios-emailcomposer
----------------------------------------------

Use the `./develop.sh` shell script to create a sample Cordova project with the EmailComposer
plugin.

The shell script should open the project in XCode.

To add the unit test target in the Xcode project:

1. Select File > New > Target
2. In the "Template for your new target" dialog, select iOS > Other > Cocoa Touch Unit Testing Bundle
3. Use `EmailComposerUnitTests` for the Product Name of the target
4. In the project directory, run 
   `cp spec/ios/* HelloCordova/platforms/ios/EmailComposerUnitTests/`
5. In Xcode, select File > Add Files to ...
6. Select all files in `HelloCordova/platforms/ios/EmailComposerUnitTests/*`
7. Select the option to add the files to the `EmailComposerUnitTests` target
8. Edit the `EmailComposerUnitTests` target in the `HelloCordova` project these frameworks and sources:
   * EmailCompser.m
   * NSData+Base64.m
   * CoreGraphics.framework
   * CoreLocation.framework
   * AssetsLibrary.framework
   * MessageUI.framework
   * MobileCoreServices.framework
   * libCordova.a
   * SenTestingKit.framework
   * UIKit.framework
   * Foundation.framework
9. In Xcode, go to Product > Schema > Edit Scheme
10. Select the Scheme "HelloCordova" and then select "Debug" in the list of actions
11. Press the "+" button to add "EmailComposerUnitTests" as a test target
12. In Xcode, go to Product > Test
13. You should see a notification that all tests passed
14. Pat yourself on the back!  That is way too many steps!
