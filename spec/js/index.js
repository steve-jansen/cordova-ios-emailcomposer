"use strict";

/* HACK: I'm using Jasmine 1.2.0 simply because that is what the Cordova sample project users
         Feel free to modify to use node/mocha or whatever for testing

         I exctracted the common expect() code into the Helper.verify() method, however,
         Jasmine v1.2.0 does not like nesting describe() and it() between closures -
         it will through errors regarding Jasmine.Suite() not being defined.
         I found a hack whereby the describe()'s live in the outer function,
         while the it()'s live in the verify() function.
*/

describe('EmailComposer', function(){
  describe('#show()', function(){
    var expected = Helper.createParams();
    var actual = EmailComposer.show(expected);
    Helper.verify(actual, expected);

    it("should use the correct callbacks", function(){
        expect(actual.onSuccess).toBe(Helper.onSuccessCallback);
        expect(actual.onError).toBe(Helper.onErrorCallback);
    });
  });

  describe('#show() with arguments but without file attachments', function(){
    var expected = Helper.createParams();
    expected.attachments = []; // clear any file attachments
    var actual = EmailComposer.show(expected);

    Helper.verify(actual, expected);
  });

  describe('#show() with arguments and file attachments', function(){
    var expected = Helper.createParams();
    var actual = EmailComposer.show(expected);
    Helper.verify(actual, expected);
  });

  describe('#show() with attachments can use strings for the encoding argument', function(){
    var expected = Helper.createParams();
    expected.attachments[0].encoding = "UTF-8";
    expected.attachments[1].encoding = "base64";

    var actual = EmailComposer.show(expected);
    expected = Helper.createParams();

    Helper.verify(actual, expected);

    it("should use the correct callbacks", function(){
        expect(actual.onSuccess).toBe(Helper.onSuccessCallback);
        expect(actual.onError).toBe(Helper.onErrorCallback);
    });
  });

  describe('when using the decrepated APIs', function(){
    describe('window.plugins.emailComposer', function(){
        describe('#showEmailComposer without attachments', function(){
            var expected = Helper.createParams();
            expected.attachments = [];

            var actual = window.plugins.emailComposer.showEmailComposer(expected.subject,
                                                                        expected.body,
                                                                        expected.to,
                                                                        expected.cc,
                                                                        expected.bcc,
                                                                        expected.isHtml);

            it("should not specify any callbacks", function(){
                expect(actual.successCallback).toBeUndefined();
                expect(actual.errorCallback).toBeUndefined();
            });

            it("should not specify any attachments", function(){
                expect(JSON.parse(actual.attachments).length).toBe(0);
            });

            Helper.verify(actual, expected);
        });

        describe('#showEmailComposer with attachments', function(){
            var expected = Helper.createParams();
            var attachments = ['/path/foo.gz', '~/bar.tar', '/some/long/path/baz.txt'];
            expected.attachments = attachments.map(function(attachment) { return { filePath: attachment}; });

            var actual = window.plugins.emailComposer.showEmailComposer(expected.subject,
                                                                        expected.body,
                                                                        expected.to,
                                                                        expected.cc,
                                                                        expected.bcc,
                                                                        expected.isHtml,
                                                                        attachments);
            it("should not specify any callbacks", function(){
                expect(actual.successCallback).toBeUndefined();
                expect(actual.errorCallback).toBeUndefined();
            });

            it("should have 3 attachments", function(){
                expect(JSON.parse(actual.attachments).length).toBe(3);
            });

            Helper.verify(actual, expected);
        });

        describe('#showEmailComposerWithCallback without attachments', function(){
            var expected = Helper.createParams();
            expected.attachments = [];

            var actual = window.plugins.emailComposer.showEmailComposerWithCallback(Helper.onSuccessCallback,
                                                                                    expected.subject,
                                                                                    expected.body,
                                                                                    expected.to,
                                                                                    expected.cc,
                                                                                    expected.bcc,
                                                                                    expected.isHtml);

            it("should specify a single callback for both error and sucess", function(){
                expect(actual.onSuccess).toBe(Helper.onSuccessCallback);
                expect(actual.onError).toBe(Helper.onSuccessCallback);
            });

            it("should not specify any attachments", function(){
                expect(JSON.parse(actual.attachments).length).toBe(0);
            });

            Helper.verify(actual, expected);
        });

        describe('#showEmailComposerWithCallback with attachments', function(){
            var expected = Helper.createParams();
            var attachments = ['/path/foo.gz', '~/bar.tar', '/some/long/path/baz.txt'];
            expected.attachments = attachments.map(function(attachment) { return { filePath: attachment}; });

            var actual = window.plugins.emailComposer.showEmailComposerWithCallback(Helper.onSuccessCallback,
                                                                                    expected.subject,
                                                                                    expected.body,
                                                                                    expected.to,
                                                                                    expected.cc,
                                                                                    expected.bcc,
                                                                                    expected.isHtml,
                                                                                    attachments);

            it("should specify a single callback for both error and sucess", function(){
                expect(actual.onSuccess).toBe(Helper.onSuccessCallback);
                expect(actual.onError).toBe(Helper.onSuccessCallback);
            });

            it("should have 3 attachments", function(){
                expect(JSON.parse(actual.attachments).length).toBe(3);
            });

            Helper.verify(actual, expected);
        });
    });
  });
});

