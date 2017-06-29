const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');
const express = require('express');

const ErrorHandler = require('../lib/ErrorHandler');
const ActionError = require('../lib/ActionError');

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
                let error = new ActionError(null, 503);
                return Promise.reject(error)
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(503, done)
        });

        it('should call use the toJSON() as response body is the error inherit from ActionError', (done) => {
            const collab = express();
            const msg = 'this is an official error message';

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.resolve()
                    .then(() => {
                        throw new ActionError(msg);
                    })
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(500)
                .expect(res => {
                    expect(res.body.reason).toEqual(msg);
                    expect(res.body.stack).toNotBe(undefined);
                })
                .end(done)
        });

        it('should dump the error in an error object', (done) => {
            const collab = express();
            const error = {msg: 'custom error', code: 11000};

            collab.use((req, res, next) => {
                // Setup
                const SUT = ErrorHandler.bind(ErrorHandler, req, res);
                // Use
                return Promise.reject(error)
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(res => {
                    expect(res.statusCode).toBe(500);
                    expect(res.body.error).toEqual(error);
                })
                .end(done)
        });
    });
});


