const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');
const express = require('express');

const ResponseHandler = require('../lib/ResponseHandler');

describe('ResponseHandler', () => {
    describe('when an empty context is passed', () => {
        it('should respond with a simple 200', (done) => {
            const collab = express();

            collab.use((req, res, next) => {
                // Setup
                const context = {};
                const SUT = ResponseHandler.bind(ResponseHandler, req, res, context);

                // Use
                return Promise.resolve("abx")
                    .then(SUT);
            });

            request(collab)
                .get('/')
                .expect(200, done)
        });
    });

    describe('when the context is modified', () => {
        it('should respond depending on context.state', (done) => {
            const collab = express();

            collab.use((req, res, next) => {
                // Setup
                const context = {
                    meta: {
                        state: 'noContent'
                    }
                };
                const SUT = ResponseHandler.bind(ResponseHandler, req, res, context);

                // Use
                return Promise.resolve(12)
                    .then(SUT);
            });

            request(collab)
                .get('/')
                .expect(204, done)
        });
    });
});