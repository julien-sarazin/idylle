const SUT = require('./ContextBuilder');
const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('ContextBuilder', () => {
    it('should forward request properties to the context', () => {
        const req = {
            body: {some: 'data'},
            files: {some: 'files'},
            token: {some: 'token'}
        };

        const FakeCriteriaBuilder = { build : () => {  }};
        let sut = new SUT(FakeCriteriaBuilder).build(req, {});

        expect(sut.data).toEqual(req.body);
        expect(sut.files).toEqual(req.files);
        expect(sut.token).toEqual(req.token);
    });

    it('should use the registered CriteriaBuilder to generate criteria', (done) => {
        const FakeCriteriaBuilder = { build : () => { done() }};
        new SUT(FakeCriteriaBuilder).build({}, {})
    });
});