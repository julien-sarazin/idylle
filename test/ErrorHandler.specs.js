const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');
const express = require('express');

const ErrorHandler = require('../lib/ErrorHandler');

describe('ErrorHandler', () => {
    describe('when no error is passed', () => {
        it('should respond with a simple 500', (done) => {
            const collab = express();

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.reject()
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(500, done)
        });
    });

    describe('when an error is passed', () => {
        it('should use the code property as HTTP status code', (done) => {
            const collab = express();

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.reject({code: 503})
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(503, done)
        });

        it('should use the error stack as reason if available', (done) => {
            const collab = express();
            const msg = 'Error: this is an official error message';

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.resolve()
                    .then(() => {
                        throw new Error(msg);
                    })
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(500)
                .then(response => {
                    expect(response.error.text)
                        .toInclude(msg)
                })
                .then(done)
        });

        it('should use the reason property as HTTP Body response', (done) => {
            const collab = express();
            const msg = 'this could be a reason';

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.reject({code: 503, reason: msg})
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(503, msg, done)
        });
    });
});


