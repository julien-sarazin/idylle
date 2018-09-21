const expect = require('expect');
const describe = require("mocha").describe;
const it = require("mocha").it;

const SUT = require('./CriteriaBuilder');
const invalid_query = { criteria: JSON.stringify(require('../test/queries/invalid_query.json')) };
const simple_query = { criteria: JSON.stringify(require('../test/queries/simple_query.json')) };
const complex_query = { criteria: JSON.stringify(require('../test/queries/complex_query.json')) };
const very_complex_query = { criteria: JSON.stringify(require('../test/queries/nested_query.json')) };

describe('CriteriaBuilder', () => {
    describe('when an invalid query is made', () => {
        it('should return an empty criteria', () => {
            const criteria = new SUT().build(invalid_query);

            expect(criteria.limit).toBe(undefined);
            expect(criteria.offset).toBe(undefined);
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
            expect(criteria.offset).toBe(3);
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
            expect(include.populate).toEqual([{ path: 'frozen_ground' }, { path: 'ice_bolt' }, { path: 'added_cold_damage' }]);
        });
    });

    describe('when a very complex query is made, with multiple combined/nested populateing spells', () => {
        let criteria = new SUT().build(very_complex_query);

        it('should build a criteria with the proper includes', () => {
            expect(criteria.includes).toBeAn(Array);
            expect(criteria.includes.length).toBe(5);

            const include_1 = criteria.includes[0];
            const include_2 = criteria.includes[1];
            const include_3 = criteria.includes[2];
            const include_4 = criteria.includes[3];
            const include_5 = criteria.includes[4];

            expect(include_1).toEqual({
                path: 'relation_1',
                populate: [{
                    path: 'relation_1.1'
                }]
            });

            expect(include_2).toEqual({
                path: 'relation_2',
            });

            expect(include_3).toEqual({
                path: 'relation_3',
                populate: {
                    path: 'relation_3.1'
                }
            });

            expect(include_4).toEqual({
                path: 'relation_4',
                populate: {
                    path: 'relation_4.1',
                    populate: {
                        path: 'relation_4.1.1'
                    }
                }
            });

            expect(include_5).toEqual({
                path: 'relation_5',
                populate: [
                    { path: 'relation_5.1' },
                    { path: 'relation_5.2' },
                    { path: 'relation_5.3', populate: { path: 'relation_5.3.1' } }
                ]
            });
        });
    });
});