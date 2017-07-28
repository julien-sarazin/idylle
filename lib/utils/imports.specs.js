const sut = require('./imports');

describe('import', () => {
    describe('basic behavior', () => {
        it('should require a file', () => {
            return sut('./test/imports/basic/foo.js').should.eventually.eql({
                foo: 'foo content'
            });
        });

        it('should create properties from the file name', () => {
            return sut('./test/imports/basic/dir').should.eventually.have.property('foo');
        });

        it('should return reject if the path does not exist', () => {
            return sut('invalid-path').should.eventually.be.undefined;
        });

        it('should normalize the provided path', () => {
            return sut('./dir/../test/imports/basic/dir').should.eventually.eql({foo: 'foo content'});
        });

        it('should return a blank object for an empty directory', () => {
            return sut('./test/imports/basic/empty').should.eventually.eql({});
        });

        it('should ignore files and directories with name starting with a dot.', () => {
            return sut('./test/imports/basic/hidden').should.eventually.eql({});
        })
    });

    describe('directory', () => {
        it('should require a directory files contents', () => {
            return sut('./test/imports/directory').should.eventually.eql({
                bar: 'bar content',
                baz: 'baz content'
            });
        });

        it('should require a directory nested files contents', () => {
            return sut('./test/imports/nested').should.eventually.eql({
                foo: 'foo content',
                bar: {
                    baz: 'baz content'
                }
            });
        });

        it('should require the file when a file and a directory share the same name', () => {
            return sut('./test/imports/conflict').should.eventually.eql({foo: 'foo content'});
        });
    });

    describe('index', () => {
        it('should require only the index.js inside a directory', () => {
            return sut('./test/imports/bim').should.eventually.eql('index content');
        });

        it('should require only the index.js inside a nested directory', () => {
            return sut('./test/imports/nestedIndexed').should.eventually.eql({sibling: 'sibling content', baz: 'baz index content'});
        });
    });

    describe('promised', () => {
        it('should wait the promised to be resolved to return value', () => {
            return sut('./test/imports/promised/resolve.js').should.eventually.eql({resolve: 'promised content'});
        });
    });

    describe('config', () => {
        describe('flatten', () => {
            it('should create flattened object keys from the path', () => {
                return sut('./test/imports', {flatten: true}).should.eventually.eql({
                    'basic.dir.foo': 'foo content',
                    'basic.foo': 'foo content',
                    'conflict.foo': 'foo content',
                    'directory.bar': 'bar content',
                    'directory.baz': 'baz content',
                    'bim': 'index content',
                    'nested.bar.baz': 'baz content',
                    'nested.foo': 'foo content',
                    'nestedIndexed.baz': 'baz index content',
                    'nestedIndexed.sibling': 'sibling content',
                    'promised.resolve': 'promised content'
                });
            });
        });
    });
});
