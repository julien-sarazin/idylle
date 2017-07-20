const _ = require('lodash');
const Context = require('./Context');
const nest = require('./utils/nest');

class ContextBuilder {
    constructor(criteriaBuilder){
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

    build(request, response) {
          return new Context(request, response, this.criteriaBuilder.build(request.query));
    }
}

module.exports = ContextBuilder;