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

    describe('when an action is built', () => {
        it('should return a function', () => {
            const sut = SUT({execute: () => {}});
            expect(() => {
                sut();
            }).toNotThrow()
        });

        it('should have an expose method', () => {
            const sut = SUT({execute: () => {}});
            expect(sut.expose).toNotBe(undefined);
        });
    });

    describe('when cache options is given', () => {
        it('should set the cache property to the returned function', () => {
            let cacheOpts = {foo: 'bar'};
            const sut = SUT({execute: () => {}, cache: cacheOpts});
            expect(sut.cache).toEqual(cacheOpts);
        })
    });
});