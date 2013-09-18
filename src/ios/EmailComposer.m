/*
 *  EmailComposer.m
 *
 *  Created by Jesse MacFadyen on 10-04-05.
 *  Copyright 2010 Nitobi. All rights reserved.
 *
 *  Modified by Steve Jansen on 10-16-12 to add support for optional file attachments.
 *  Modified by Steve Jansen on 11-06-12 to upgrade to the Cordova 2.1 void:(CDVInvokedUrlCommand*) signature.
 *  Modified by Steve Jansen on 06-09-13 to integrate Guido Sabatini's detection of mime type for file attachments
 *                                          that use a file system path
 *
 *  MIT Licensed
 */

#import "EmailComposer.h"
#import "NSData+Base64.h"

@implementation EmailComposer

@synthesize callbackId = _callbackId;

// the public entry point of this Corodova plugin to show the iOS Mail.app view to compose a new message
- (void) show:(CDVInvokedUrlCommand*)command
{
    NSArray* map;
    NSString* to;
    NSString* cc;
    NSString* bcc;
    NSString* subject;
    NSString* body;
    NSString* isHtml;
    NSString* attachmentsJSON;

    self.callbackId = command.callbackId;
    
    if(!self.picker) {
        self.picker = [[MFMailComposeViewController alloc] init];
    }

    if (!self.picker)
        return;
    
    self.picker.mailComposeDelegate = self;

    if (command.arguments.count > 0)
    {
        map = [command.arguments objectAtIndex:0];
        
        if (map != nil)
        {
            to = [map valueForKey:@"to"];
            cc = [map valueForKey:@"cc"];
            bcc = [map valueForKey:@"bcc"];
            subject = [map valueForKey:@"subject"];
            body = [map valueForKey:@"body"];
            isHtml = [map valueForKey:@"isHtml"];
            attachmentsJSON = [map valueForKey:@"attachments"];
        
            if([self argumentExists:subject])
                [self.picker setSubject:subject];
    
            if([self argumentExists:body])
            {
                if(isHtml != nil && [isHtml boolValue])
                    [self.picker setMessageBody:body isHTML:YES];
                else
                    [self.picker setMessageBody:body isHTML:NO];
            }
    
            if([self argumentExists:to])
                [self.picker setToRecipients:[to componentsSeparatedByString:@","]];
            
            if([self argumentExists:cc])
                [self.picker setCcRecipients:[cc componentsSeparatedByString:@","]];
    
            if([self argumentExists:bcc])
                [self.picker setBccRecipients:[bcc componentsSeparatedByString:@","]];
    
            if([self argumentExists:attachmentsJSON])
                [self addAttachments:self.picker withConfig:attachmentsJSON];
        }
    }


    [self.viewController presentViewController:self.picker animated:YES completion:NULL];
    
    // ARC support
    #if !(__has_feature(objc_arc))
        [self.picker release];
    #endif
}

- (void) addAttachments:(MFMailComposeViewController*)picker withConfig:(NSString*)jsonConfig
{
    NSArray* attachments = [self deserializeAttachmentConfig:jsonConfig];
    NSDictionary* item;
    
    if ( attachments != nil ) {
        for(item in attachments) {
            [self addAttachment:picker withConfig:item];
        }
    }
}

- (void) addAttachment:(MFMailComposeViewController*)picker withConfig:(NSDictionary*)attachment
{
    const int BASE64_ENCODING = 0;
    NSString* mimeType = [attachment valueForKey:@"mimeType"];
    NSNumber* encoding = [attachment valueForKey:@"encoding"];
    NSString* name = [attachment valueForKey:@"name"];
    NSString* filePath = [attachment valueForKey:@"filePath"];
    NSString* encodedData = [attachment valueForKey:@"data"];
    NSData* data = nil;
    int encodingValue = 0;
    
    
    if([self argumentExists:encodedData] && encoding != nil)
    {
        encodingValue = [encoding intValue];
        
        if (encodingValue == BASE64_ENCODING)
            data = [NSData dataFromBase64String:encodedData];
        else
            // use the NSString method to convert text to NSData
            data = [encodedData dataUsingEncoding:encodingValue];
    }
    else if([self argumentExists:filePath] && [[NSFileManager defaultManager] fileExistsAtPath:filePath])
    {
        // read the contents of the file into the buffer
        data = [NSData dataWithContentsOfFile:filePath];

        // override any explictly provided mime type and use the iOS determined mime-type instead
        mimeType = [self getMimeTypeFromFileExtension:filePath];

        // default to the base name of the file if an attachment name was not specified
        if(! [self argumentExists:name] )
            name = [filePath lastPathComponent];
    }
    
    // add the attachment only if all arguments are non-nil with more than 0 bytes/chars
    if ([data length] && [mimeType length] && [name length])
    {
        [picker addAttachmentData:data mimeType:mimeType fileName:name];
    }
}

- (NSArray*)deserializeAttachmentConfig:(NSString*)attachmentsJSON
{
    NSError* jsonParsingError = nil;
    NSData* jsonData = [attachmentsJSON dataUsingEncoding:NSUTF8StringEncoding];
    NSArray* jsonArray = nil;
    CDVPluginResult* pluginResult = nil;
    NSString* javaScript = nil;
    
    jsonArray = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&jsonParsingError];
    
    if (jsonArray == nil)
    {
        // the JSON string cannot be deserialized
        // log to the debug console
        NSLog(@"Error parsing JSON: %@",[jsonParsingError description]);
        // log to the error callback/handler of the JS client, if a callback was specified
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_JSON_EXCEPTION];
        javaScript = [pluginResult toErrorCallbackString:[self callbackId]];
        [self writeJavascript:javaScript];
    }
    
    return jsonArray;
}

// Dismisses the email composition view when the user taps Cancel or Send. 
// Notifies the JS caller of the Mail.app result via the success or error callback
- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error
{
    CDVPluginResult* pluginResult = nil;
    int composeResult = 0;

    [self.viewController dismissViewControllerAnimated:YES completion:NULL];
    self.picker = nil;

    // corresponds to the EmailComposer.ComposeResult enum of the JS API
    switch (result)
    {
        case MFMailComposeResultCancelled:
            composeResult = 0;
            break;
        case MFMailComposeResultSaved:
            composeResult = 1;
            break;
        case MFMailComposeResultSent:
            composeResult = 2;
            break;
        case MFMailComposeResultFailed:
            composeResult = 3;
            break;
        default:
            composeResult = 4;
            break;
    }
    
    
    if ( result < MFMailComposeResultFailed )
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:composeResult];
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:composeResult];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:[self callbackId]];
    self.callbackId = nil;
}

// Retrieve the mime type from the file extension
// Defaults to application/octet-stream if iOS cannot determine the mime type
-(NSString *) getMimeTypeFromFileExtension:(NSString *)filePath {
    NSString *const defaultValue = @"application/octet-stream";
    NSString *pathExtension;
    NSString *value;
    CFStringRef type;

    if (!filePath)
        return defaultValue;

    pathExtension = [filePath pathExtension];

    if (!pathExtension || ![pathExtension length])
        return defaultValue;

    // Get the UTI from the file's extension
    type = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)pathExtension, NULL);
    
    // Converting UTI to a mime type
    value = (__bridge NSString *)UTTypeCopyPreferredTagWithClass(type, kUTTagClassMIMEType);

    if (!value || ![value length])
        return defaultValue;

    return value; 
}

-(BOOL) argumentExists:(NSString *) argument {
    return (argument != nil && ![argument isEqual:[NSNull null]] && [argument length] > 0);
}

@end
