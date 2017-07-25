const nest = {};
const REGEXP = {
    ALLOWED_CHARACTERS: /[A-Za-z0-9\.\-\_\$]/g,
    STARTING_DOT: /^\./g,
    TRAILING_DOT: /\.$/,
    MULTIPLE_DOTS: /\.+/g
};

/**
 *
 * @param path
 * @return {*}
 */
nest.normalize = (path) => {
    if (!path)
        return '';

    return path
        .match(REGEXP.ALLOWED_CHARACTERS)
        .join('')
        .replace(REGEXP.STARTING_DOT, '')
        .replace(REGEXP.TRAILING_DOT, '')
        .replace(REGEXP.MULTIPLE_DOTS, '.');
};

/**
 *
 * @param object
 * @param path
 * @return {boolean}
 */
nest.exists = (object, path) => {
    if (!object)
        throw new Error('Missing object');

    return !(nest.normalize(path).split('.').some(childDoesNotExist));

    function childDoesNotExist(path){
        if(!object.hasOwnProperty(path))
            return true;
        object = object[path];
        return false;
    }
};

/**
 *
 * @param object
 * @return {*}
 */
nest.paths = (object) => {
    return Object.keys(object)
        .reduce(lookupPath, []);

    function lookupPath(lookedUpPaths, path){
        let value = nest.get(object, path);
        if (isObjectWithNestedKeys(value)){
            return  Object.keys(value)
                .map(prependCurrentPath)
                .reduce(lookupPath, lookedUpPaths);
        }

        lookedUpPaths.push(path);
        return lookedUpPaths;

        function prependCurrentPath(prependTo){
            return path + '.' + prependTo;
        }
    }

    function isObjectWithNestedKeys(o){
        return (typeof(o) != 'function')
            && (o === Object(o))
            && !(o instanceof Array)
            && !(o instanceof Date)
            && (Object.keys(o).length);
    }
};

/**
 *
 * @param object
 * @param path
 * @return {*}
 */
nest.get = (object, path) => {
    if (!object)
        throw new Error('Missing object');

    return nest.normalize(path)
        .split('.')
        .reduce(getProperty, object);

    function getProperty(object, property){
        if (!property)
            return object;
        return (object)? object[property] : undefined;
    }
};

/**
 *
 * @param target
 * @param path
 * @param value
 * @return {*}
 */
nest.set = (target, path, value) => {
    if (!path)
        throw new Error('Empty path');

    path = nest.normalize(path)
        .split('.');

    let parentPaths = path.slice(0, path.length - 1);
    let childPath = path[path.length - 1];

    parentPaths.reduce(createProperty, target)[childPath] = value;
    return target;

    function createProperty(target, property){
        return target[property] = target[property] || {};
    }
};

/**
 *
 * @param target
 * @param paths
 * @param source
 */
nest.retain = (target, paths, source) => {
    return paths
        .map(nest.normalize)
        .reduce(retainPath, target);

    function retainPath(target, path){
        let value = nest.get(source, path);
        if(value === undefined)
            return target;

        return nest.set(target, path, value);
    }
};

/**
 *
 * @param target
 * @param paths
 * @param source
 */
nest.replace = (target, paths, source) => {
    if (!target)
        throw new Error('Missing target');

    if (!source)
        throw new Error('Missing source');

    let existsInTarget = nest.exists.bind(null, target);
    let existsInSource = nest.exists.bind(null, source);
    let existingPaths = paths
        .filter(existsInTarget)
        .filter(existsInSource);

    return nest.retain(target, existingPaths, source);
};

/**
 *
 * @param object
 */
nest.flatten = (object) => {
    return nest.paths(object)
        .reduce(setValues, {});

    function setValues(result, path){
        result[path] = nest.get(object, path);
        return result;
    }
};

/**
 *
 * @param object
 * @return {*}
 */
nest.inflate = (object) => {
    if (!object)
        throw new Error('Missing object');

    return Object.keys(object)
        .map(nest.normalize)
        .reduce(nestProperty, {});

    function nestProperty(result, propertyName){
        return nest.set(result, propertyName, object[propertyName]);
    }
};

/**
 *
 * @param target
 * @param source
 */
nest.merge = (target, source) => {
    return nest.retain(target, nest.paths(source), source);
};

module.exports = nest;