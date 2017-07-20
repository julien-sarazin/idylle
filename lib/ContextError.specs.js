const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;

const ContextError = require('./ContextError');

describe('ContextError', () => {
    describe('contructor(), when no message is passed', () => {
        it('should contain an empty string as message', () => {
            let sut = new ContextError();
            expect(sut.message).toEqual("");
        });

        it('should contain an HTTP code 500', () => {
            let sut = new ContextError();
            expect(sut.code).toEqual(500);
        });
    });

    describe('constructor(), when message and code are passed', () => {
        it('should contain an empty string as message', () => {
            const msg = "Potential Error";
            const code = 400;
            let sut = new ContextError(msg, code);
            expect(sut.message).toEqual(msg);
            expect(sut.code).toEqual(code);

        });
    });

    describe('toJSON()', () => {
        describe('when no message is passed', () => {
            it('should contain an object with an empty reason', () => {
                let sut = new ContextError();
                expect(sut.toJSON()).toEqual({reason: ""});
            });
        });

        describe('when a message is passed', () => {
            it('should contain the message in the reason property', () => {
                const msg = 'message';
                let sut = new ContextError(msg);
                expect(sut.toJSON()).toEqual({reason: msg});
            });
        });

        describe('when a the stack options is passed, should print the stack trace', () => {
            it('should contain the message in the reason property', () => {
                let sut = new ContextError();
                let options = {stack: true};
                expect(sut.toJSON(options).stack).toNotBe(undefined);
            });
        });

    });
});


