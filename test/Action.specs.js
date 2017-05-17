const SUT = require('../index').Action;
const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Action', () => {
    describe('when the execute property is not set', () => {
        it('should throw an exception', () => {
            expect(() => {
                SUT()
            }).toThrow()
        });
    });

    describe('when the execute property is not a function', () => {
        it('should throw an exception', () => {
            expect(() => {
                SUT({execute: 'foo'})
            }).toThrow()
        })
    });
});