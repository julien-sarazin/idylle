/**
 *
 * @param query the raw request query from express
 * @return {*} an object that contains specific queries for ORMS
 * like mongoose or sequelize.
 */


class CriteriaBuilder {
    constructor() {}

    static default() {
        return {
            limit: undefined,
            skip: undefined,
            where: {},
            sort: undefined,
            includes: []
        };
    }

    build(query) {
        const criteria = CriteriaBuilder.default();

        try {
            const raw = JSON.parse(query.criteria);

            this.buildLimit(raw, criteria);
            this.buildOffset(raw, criteria);
            this.buildWhere(raw, criteria);
            this.buildSort(raw, criteria);
            this.buildIncludes(raw, criteria);

            return criteria;
        }
        catch (error) {
            return criteria
        }
    };

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildSort(query, criteria) {
        if (!query.sort)
            return criteria;

        criteria.sort = query.sort;
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildWhere(query, criteria) {
        if (!query.where)
            return criteria;

        criteria.where = query.where;
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildLimit(query, criteria) {
        if (!query.limit)
            return criteria;

        criteria.limit = parseInt(query.limit);
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildOffset(query, criteria) {
        if (!query.offset)
            return criteria;

        criteria.skip = parseInt(query.offset);
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildIncludes(query, criteria) {
        if (!query.includes)
            return criteria;

        query.includes.forEach((i) => {
            let include = parse(i, {});
            criteria.includes.push(include);
        });

        return criteria;

        /**
         *
         * @param query     An include query.
         * @param criteria  {Object} The raw criteria.
         * @return {Object} Mongoose decorated criteria from request's query.
         */
        function parse(query, crit) {
            crit.path = crit.path || '';

            if (query instanceof Array) {
                crit.path += `${query.join(' ')}`;
            }

            else if (typeof query === 'string') {
                crit.path += `${query}`;
            }

            else if (query.toString() === '[object Object]') {
                for (let item in query) {
                    crit.path += `${item}`;
                    crit.populate = crit.populate || {};
                    parse(query[item], crit.populate)
                }
            }

            return crit;
        }
    }
}


module.exports = CriteriaBuilder;