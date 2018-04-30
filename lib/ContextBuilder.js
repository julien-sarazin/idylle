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

    normalize(context, type) {
        const ContextClass = type === '__ws'
            ? IOContext
            : HTTPContext;

        context = nest.inflate(context);
        context = (context instanceof HTTPContext || context instanceof IOContext)
            ? context
            : _.merge(new ContextClass(), context);

        context.criteria = _.merge(context.criteria, this.criteriaBuilder.default());

        return context;
    }

    buildHTTP(request, response) {
        return new HTTPContext(request, response, this.criteriaBuilder);
    }

    buildIO(socket, data) {
        return new IOContext(socket, data, this.criteriaBuilder);
    }
}

module.exports = ContextBuilder;