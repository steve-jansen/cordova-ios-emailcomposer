//
//  EmailComposer.h
//
//
//  Created by Jesse MacFadyen on 10-04-05.
//  Copyright 2010 Nitobi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MessageUI/MFMailComposeViewController.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <Cordova/CDV.h>

@interface EmailComposer : CDVPlugin < MFMailComposeViewControllerDelegate > {
    NSString* _callbackId;
}

@property(nonatomic, strong) NSString* callbackId;

/// support dependency injection of a mock MFMailComposeViewController for unit testing
@property(nonatomic, strong) MFMailComposeViewController* picker;

- (void) show:(CDVInvokedUrlCommand*)command;

@end