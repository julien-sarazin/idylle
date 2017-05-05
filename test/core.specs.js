const SUT = require('../index');
const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const sinon = require('sinon');

describe('Idyll', () => {
    describe('during initialization', () => {
        it('should never call invalid listeners', () => {
            const sut = new SUT();
            const invalid_event = 'invalid.event';

            sut.on(invalid_event, () => {
                expect(false).toBe(true);
            })
        });

        it('should call valid listeners', (done) => {
            const sut = new SUT();

            sut.on(SUT.events.started, () => {
                done()
            });

            sut.start();
        });

        it('should not be dependant of registering order', (done) => {
            const sut = new SUT();
            const events = [];

            sut.on(SUT.events.init.middlewares, (idyll) => {
                expect(events.length).toEqual(1);
                events.push(null);
            });

            sut.on(SUT.events.init.settings, (idyll) => {
                expect(events.length).toEqual(0);
                events.push(null);
                done();
            });

            sut.start();
        });
    });
});