const expect = require('expect');
const describe = require("mocha").describe;
const it = require("mocha").it;

const SUT                   = require('./CriteriaBuilder');
const invalid_query         = {criteria: JSON.stringify(require('../test/queries/invalid_query.json'))};
const simple_query          = {criteria: JSON.stringify(require('../test/queries/simple_query.json'))};
const complex_query         = {criteria: JSON.stringify(require('../test/queries/complex_query.json'))};
const very_complex_query    = {criteria: JSON.stringify(require('../test/queries/nested_query.json'))};

describe('CriteriaBuilder', () => {
    describe('when an invalid query is made', () => {
        it('should return an empty criteria', () => {
            const criteria = new SUT().build(invalid_query);

            expect(criteria.limit).toBe(undefined);
            expect(criteria.skip).toBe(undefined);
            expect(criteria.sort).toBe(undefined);
            expect(criteria.where).toEqual({});
            expect(criteria.includes).toBeAn(Array);
            expect(criteria.includes.length).toBe(0);
        });
    });

    describe('when a simple query is made', () => {
        const criteria = new SUT().build(simple_query);

        it('should build a criteria with the proper limit', () => {
            expect(criteria.limit).toBe(10);
        });

        it('should build a criteria with the proper offset', () => {
            expect(criteria.skip).toBe(3);
        });

        it('should build a criteria with the proper includes', () => {
            expect(criteria.includes).toBeAn(Array);
            expect(criteria.includes.length).toBe(2);
        });
    });

    describe('when a complex oder is made, with more than one include', () => {
        const criteria = new SUT().build(complex_query);

        it('should build a criteria with the proper includes', () => {
            expect(criteria.includes).toBeAn(Array);
            expect(criteria.includes.length).toBe(1);


            const include = criteria.includes[0];
            expect(include.path).toBe('cold_weaknesses');
            expect(include.populate).toEqual({path: 'frozen_ground ice_bolt added_cold_damage'});
        });
    });

    describe('when a very complex query is made, with multiple combined/nested populateing spells', () => {
        let criteria = new SUT().build(very_complex_query);

        it('should build a criteria with the proper includes', () => {
            expect(criteria.includes).toBeAn(Array);
            expect(criteria.includes.length).toBe(3);


            const include_1 = criteria.includes[0];
            expect(include_1.path).toBe('foo');
            expect(include_1.populate).toEqual({path: 'bar'});

            const include_2 = criteria.includes[1];
            expect(include_2.path).toBe('foo');

            const include_3 = criteria.includes[2];
            expect(include_3.path).toBe('foo');

            const populate = include_3.populate;
            expect(populate).toBeAn(Object);
            expect(populate.path).toBe('bar');
            expect(populate.populate).toEqual({path: 'baz', populate: { path: 'bur tar'}});
        });
    });
});