#import "EmailComposerUnitTests.h"

@implementation EmailComposerUnitTests

- (void)setUp
{
    [super setUp];
    
    // Set-up code here.
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}


- (void)all_fields_are_blank_by_default
{
    
    EmailComposer *composer = [[EmailComposer alloc] init];
    MockMailComposeViewController *picker = [[MockMailComposeViewController alloc]init];
    [composer setPicker:picker];
    
    NSDictionary* map = [[NSDictionary alloc] initWithObjectsAndKeys:
                         nil];
    
    CDVInvokedUrlCommand *command = [[CDVInvokedUrlCommand alloc]  initWithArguments:[[NSArray alloc] initWithObjects:map, nil] callbackId:nil className:@"EmailComposer" methodName:@"show"];
    
    [composer show:command];
    
    STAssertEqualObjects(@"", picker.toRecipients, @"to line");
    STAssertEqualObjects(@"", picker.ccRecipients, @"cc line");
    STAssertEqualObjects(@"", picker.bccRecipients, @"bcc line");
    STAssertEqualObjects(@"", picker.subject, @"subject line");
    STAssertEqualObjects(@"", picker.body, @"message body");
    STAssertFalse(picker.isHTML, @"message body is html");
}

- (void)can_set_a_subject_line
{
    
    EmailComposer *composer = [[EmailComposer alloc] init];
    MockMailComposeViewController *picker = [[MockMailComposeViewController alloc]init];
    [composer setPicker:picker];
    
    NSDictionary* map = [[NSDictionary alloc] initWithObjectsAndKeys:
                         @"test subject line", @"subject",
                         nil];
    
    
    CDVInvokedUrlCommand *command = [[CDVInvokedUrlCommand alloc]  initWithArguments:[[NSArray alloc] initWithObjects:map, nil] callbackId:nil className:@"EmailComposer" methodName:@"show"];
    
    [composer show:command];
    
    STAssertEqualObjects(@"test subject line", picker.subject, @"subject line test");
}

- (void)can_set_a_subject_line2
{
    
    EmailComposer *composer = [[EmailComposer alloc] init];
    MockMailComposeViewController *picker = [[MockMailComposeViewController alloc]init];
    [composer setPicker:picker];
    
    NSDictionary* map = [[NSDictionary alloc] initWithObjectsAndKeys:
                         @"john.doe@example.com, jane.doe@example.com", @"to",
                         @"john.doe@example.com, jane.doe@example.com", @"cc",
                         @"john.doe@example.com, jane.doe@example.com", @"bcc",
                         @"test subject line", @"subject",
                         @"test body message", @"body",
                         @"true", @"isHtml",
                         @"", @"attachments",
                         nil];
    
    
    //NSArray *json = [[NSArray alloc]initWithObjects:[NSNull null], @"EmailComposer", @"show", args, nil];
    
    CDVInvokedUrlCommand *command = [[CDVInvokedUrlCommand alloc]  initWithArguments:[[NSArray alloc] initWithObjects:map, nil] callbackId:nil className:@"EmailComposer" methodName:@"show"];
    
    [composer show:command];
    
    STAssertEqualObjects(@"test subject line", picker.subject, @"subject line test");
}

@end
