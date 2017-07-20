const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');
const express = require('express');

const ErrorHandler = require('./ErrorHandler');
const ContextError = require('./ContextError');

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
                let error = new ContextError(null, 503);
                return Promise.reject(error)
                    .catch(SUT);
            });

            request(collab)
                .get('/')
                .expect(503, done)
        });

        it('should ignore invalid status code', (done) => {
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
                    expect(res.body.reason).toEqual(error);
                })
                .end(done)
        });
    });
});


