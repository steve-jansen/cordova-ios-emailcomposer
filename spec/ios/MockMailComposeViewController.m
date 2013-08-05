#import "MockMailComposeViewController.h"

@implementation MockMailComposeViewController

- (void)setBody:(NSString *)body withIsHTML:(BOOL)isHTML
{
    _body = body;
    _isHTML = isHTML;
}


- (void) addAttachmentData:(NSData*)data withMimeType:(NSString*) mimeType withFileName:(NSString*)fileName
{
    if (!_attachments)
        _attachments = [[NSMutableArray alloc] init];
    
    MockMailComposeViewAttachment *attachment = [[MockMailComposeViewAttachment alloc] init];
    [attachment setData:data];
    [attachment setMimeType:mimeType];
    [attachment setFileName:fileName];
     
    
    [_attachments addObject:attachment];
}

@end


@implementation MockMailComposeViewAttachment
@end

