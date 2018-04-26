const _ = require('lodash');
const HTTPContext = require('./HTTPContext');
const IOContext = require('./IOContext');
const nest = require('./utils/nest');

class ContextBuilder {
    constructor(criteriaBuilder) {
        if (typeof (criteriaBuilder) !== 'object')
            throw new Error('Invalid CriteriaBuilder');

        this.criteriaBuilder = criteriaBuilder;
    }

    normalize(context) {
        context = nest.inflate(context);
        context = (context instanceof Context) ? context : _.merge(new Context(), context);
        context.criteria = _.merge(context.criteria, this.criteriaBuilder.default());
        return context;
    }

    buildHTTP(request, response) {
        return new HTTPContext(request, response, this.criteriaBuilder);
    }

    buildIO(socket, packet) {
        return new IOContext(socket, packet, this.criteriaBuilder);
    }
}

module.exports = ContextBuilder;