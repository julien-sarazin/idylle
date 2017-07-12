const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const recursive = Promise.promisify(require('recursive-readdir'));
const path = require('path');
const nest = require('./nest');

module.exports = (rootPath, config) => {
    config = config || {};
    rootPath = path.normalize(rootPath);

    return fs.statAsync(rootPath)
        .then(requireContent);

    function requireContent(stats) {
        if (stats.isFile()) {
            const key = path.parse(rootPath).name;
            const object = {};
            object[key] = require(normalizeRequirePath(rootPath));
            return object;
        }

        return recursive(rootPath)
            .filter(hiddenFilesAndDirectories)
            .map(updateFilesToRequire)
            .then(ignoreIndexSibling)
            .then(ignoreDirectoriesWithSameFilename)
            .then(serialize);

        function hiddenFilesAndDirectories(file) {
            return !file.match(/(^\.\w+)|([\\\/]\.\w+)/);
        }

        function updateFilesToRequire(files) {
            return path.parse(files);
        }

        function ignoreIndexSibling(meta) {
            const pathHasIndex = meta.filter(hasIndex)
                .reduce(indexByPath, {});

            return meta.filter(notIndexSibling);

            function hasIndex(fileMeta) {
                return fileMeta.base === 'index.js';
            }

            function indexByPath(result, current) {
                result[current.dir] = true;
                return result;
            }

            function notIndexSibling(fileMeta) {
                return fileMeta.base === 'index.js' || !pathHasIndex[fileMeta.dir];
            }
        }

        function ignoreDirectoriesWithSameFilename(meta) {
            const pathsToIgnore = meta.map(pathToIgnore);
            return meta.filter(notInPathsToIgnore);

            function pathToIgnore(meta) {
                return path.join(meta.dir, meta.name);
            }

            function notInPathsToIgnore(fileMeta) {
                return !pathsToIgnore.some(matchFileMeta);

                function matchFileMeta(aPath) {
                    return fileMeta.dir.indexOf(aPath) === 0;
                }
            }
        }

        function serialize(meta) {
            const object = meta.reduce(toObject, {});
            if (config.flatten)
                return object;

            if (typeof object === 'object')
                return nest.inflate(object);

            return object;

            function toObject(result, current) {
                const pathKey = current.dir
                    .replace(rootPath, '')
                    .replace(/[\\\/]/g, '.')
                    .concat('.')
                    .concat(current.name)
                    .replace('.index', '')
                    .replace('.', '');

                if (pathKey.length === 0)
                    return require(normalizeRequirePath(path.join(current.dir, current.base)));

                result[pathKey] = require(normalizeRequirePath(path.join(current.dir, current.base)));
                return result;
            }
        }
    }

    function normalizeRequirePath(requirePath) {
        const relativeRequirePath = path.join(path.relative(__dirname, process.cwd()), requirePath);
        return './' + (relativeRequirePath.replace(/\\/g, '/'))
    }
};