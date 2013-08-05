#import <Foundation/Foundation.h>
#import <MessageUI/MFMailComposeViewController.h>

@interface MockMailComposeViewController : MFMailComposeViewController

@property (nonatomic, copy) NSString* toRecipients;

@property (nonatomic, copy) NSString* ccRecipients;

@property (nonatomic, copy) NSString* bccRecipients;

@property (nonatomic, copy) NSString* subject;

@property (nonatomic, copy) NSString* body;

@property (nonatomic) BOOL isHTML;

@property (nonatomic, copy) NSMutableArray* attachments;

@end

@interface MockMailComposeViewAttachment : NSObject

@property (nonatomic, copy) NSData* data;
@property(nonatomic, copy) NSString* mimeType;
@property(nonatomic, copy) NSString* fileName;

@end


