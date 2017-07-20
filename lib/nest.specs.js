const sut = require('./nest.js');

describe('sut', function () {
    describe('#normalize()', function () {
        it('should remove the extra dots in case of consecutive dots', function () {
            const path = 'foo...bar';

            sut.normalize(path).should.equal('foo.bar');
        });

        it('should remove the initial dot', function () {
            const path = '.foo.bar';

            sut.normalize(path).should.equal('foo.bar');
        });

        it('should remove the dot at the end', function () {
            const path = 'foo.bar.';

            sut.normalize(path).should.equal('foo.bar');
        });

        it('should remove non allowed characters', function () {
            const path = 'foo/\\*=,\'"!é.bar';

            sut.normalize(path).should.equal('foo.bar');
        });

        it('should return an empty string when the path is not given', function () {
            sut.normalize().should.equal('');
        });

        it('should return empty string when the path is an empty string', function () {
            sut.normalize('').should.equal('');
        });

        it('should return an empty string when the path is null', function () {
            sut.normalize(null).should.equal('');
        });

        it('should return an empty string when the path is undefined', function () {
            sut.normalize(undefined).should.equal('');
        });
    });

    describe('#exists()', function () {
        it('should return true on an existing property', function () {
            const object = {
                foo: undefined
            };
            const path = 'foo';

            sut.exists(object, path).should.be.true;
        });

        it('should return false on a non-existing property', function () {
            const object = {};
            const path = 'foo';

            sut.exists(object, path).should.be.false;
        });

        it('should return true on an existing path', function () {
            const object = {
                foo: {
                    bar: undefined
                }
            };
            const path = 'foo.bar';

            sut.exists(object, path).should.be.true;
        });

        it('should return false on a non-existing path', function () {
            const object = {};
            const path = 'foo.bar';

            sut.exists(object, path).should.be.false;
        });
    });

    describe('#paths()', function () {
        it('should return an array of flattened paths for nested object', function () {
            const object = {
                foo: {
                    bar: 'bar'
                }
            };

            sut.paths(object).should.deep.equal(['foo.bar']);
        });

        it('should return an array of object paths for non-nested object', function () {
            const object = {
                foo: 'foo',
                bar: 'bar'
            };

            sut.paths(object).should.deep.equal(['foo', 'bar']);
        });

        it('should flatten the keys with empty object', function () {
            const object = {
                foo: {
                    bar: {}
                }
            };

            sut.paths(object).should.deep.equal(['foo.bar']);
        });

        it('should not flatten an array', function () {
            const object = {
                foo: ['bar', 'baz']
            };

            sut.paths(object).should.eql(['foo']);
        });

        it('should throw an error if object is not given', function () {
            function pathsOfNothing() {
                return sut.paths();
            }

            pathsOfNothing.should.throw();
        });
    });


    describe('#get()', function () {
        it('should return value for a non nested path', function () {
            const object = {
                foo: 'foo'
            };
            const path = 'foo';

            sut.get(object, path).should.equal('foo');
        });

        it('should return value for a nested path', function () {
            const object = {
                foo: {
                    bar: {
                        baz: 'baz'
                    }
                }
            };
            const path = 'foo.bar.baz';

            sut.get(object, path).should.equal('baz');
        });

        it('should return undefined if the path does not exist', function () {
            const object = {};
            const path = 'foo.bar';

            let result = sut.get(object, path);
            (typeof result).should.be.equal('undefined');
        });

        it('should return the object when the path is empty', function () {
            const object = {
                foo: 'foo'
            };

            sut.get(object).should.deep.equal(object);
        });

        it('should throw an error when the object is not given', function () {
            function getEmptyObject() {
                return sut.get();
            }

            getEmptyObject.should.throw();
        });
    });

    describe('#set()', function () {
        it('should return the given object', function () {
            const object = {
                foo: 'foo'
            };
            const path = 'foo';
            const value = 'foo';

            sut.set(object, path, value).should.equal(object);
        });

        it('should override value for a non-nested path', function () {
            const object = {
                foo: 'foo'
            };
            const path = 'foo';
            const value = 'bar';

            sut.set(object, path, value);

            object.should.deep.equal({foo: 'bar'});
        });

        it('should override value for a nested path', function () {
            const object = {
                foo: {
                    bar: {
                        baz: 'baz'
                    }
                }
            };
            const path = 'foo.bar.baz';
            const value = 'ban';

            sut.set(object, path, value);

            object.should.deep.equal({foo: {bar: {baz: 'ban'}}})
        });

        it('should set value for a non-existing path', function () {
            const object = {};
            const path = 'foo';
            const value = 'foo';

            sut.set(object, path, value);

            object.should.deep.equal({foo: 'foo'});
        });

        it('should throw an error when the path is empty', function () {
            const object = {
                foo: 'foo'
            };
            const path = '';

            function setEmptyPath() {
                return sut.set(object, path);
            }

            setEmptyPath.should.throw();
        });

        it('should throw an error when the object is not given', function () {
            function setEmptyObject() {
                return sut.set();
            }

            setEmptyObject.should.throw();
        });
    });

    describe('#retain()', function () {
        it('should return the given target', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                foo: 'foo'
            };
            const paths = ['foo'];

            sut.retain(target, paths, source).should.equal(target);
        });

        it('should override values for non-nested paths', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                foo: 'source foo'
            };
            const paths = ['foo'];

            sut.retain(target, paths, source);

            target.should.deep.equal({foo: 'source foo'});
        });

        it('should override values for nested paths', function () {
            const target = {
                foo: {
                    bar: 'bar'
                }
            };
            const source = {
                foo: {
                    bar: 'source bar'
                }
            };
            const paths = ['foo.bar'];

            sut.retain(target, paths, source);

            target.should.deep.equal({foo: {bar: 'source bar'}});
        });

        it('should add values for non-existing paths', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                bar: 'bar',
                baz: 'baz'
            };
            const paths = ['bar'];

            sut.retain(target, paths, source);

            target.should.deep.equal({foo: 'foo', bar: 'bar'});
        });

        it('should not do anything if paths do not exist in source', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                bar: 'bar'
            };
            const paths = ['baz'];

            sut.retain(target, paths, source);

            target.should.deep.equal({foo: 'foo'});
        });

        it('should throw an error when the source is not given', function () {
            const target = {
                foo: 'foo'
            };
            const paths = ['bar'];

            function retainFromUnexistingSource() {
                return sut.retain(target, paths);
            }

            retainFromUnexistingSource.should.throw();
        });
    });

    describe('#replace()', function () {
        it('should return the given target', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                foo: 'foo'
            };
            const paths = ['foo'];

            sut.replace(target, paths, source).should.equal(target);
        });

        it('should replace non-nested values', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                foo: 'foo source'
            };
            const paths = ['foo'];

            sut.replace(target, paths, source);

            target.should.deep.equal({foo: 'foo source'});
        });

        it('should replace nested values', function () {
            const target = {
                foo: {
                    bar: 'bar'
                }
            };
            const source = {
                foo: {
                    bar: 'source bar'
                }
            };
            const paths = ['foo'];

            sut.replace(target, paths, source);

            target.should.deep.equal({foo: {bar: 'source bar'}});
        });

        it('should do nothing if paths do not exist in source', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                bar: 'bar'
            };
            const paths = ['baz'];

            sut.replace(target, paths, source);

            target.should.deep.equal({foo: 'foo'});
        });

        it('should do nothing if paths do not exist in target', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                bar: 'bar'
            };
            const paths = ['bar'];

            sut.replace(target, paths, source);

            target.should.deep.equal({foo: 'foo'});
        });

        it('should throw an error if source is not given', function () {
            const target = {
                foo: 'foo'
            };
            const paths = ['foo'];


            function replaceWithNonExistingSource() {
                return sut.replace(target, paths);
            }

            replaceWithNonExistingSource.should.throw();
        });

        it('should throw an error if target is not given', function () {
            function replaceWithNoTarget() {
                return sut.replace();
            }

            replaceWithNoTarget.should.throw();
        });
    });


    describe('#flatten()', function () {
        it('should return a flattened object if nested', function () {
            const object = {
                foo: {
                    bar: 'bar'
                }
            };

            sut.flatten(object).should.deep.equal({'foo.bar': 'bar'});
        });

        it('should return the object if not nested', function () {
            const object = {
                foo: 'foo'
            };

            sut.flatten(object).should.deep.equal({foo: 'foo'});
        });

        it('should throw an error if object is not given', function () {
            function flattenNothing() {
                return sut.flatten();
            }

            flattenNothing.should.throw();
        });

        it('should flatten the keys with empty object', function () {
            const object = {
                foo: {
                    bar: {}
                }
            };

            sut.flatten(object).should.deep.equal({'foo.bar': {}});
        });
    });

    describe('#merge()', function () {
        it('should override values for non-nested paths', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                foo: 'foo source'
            };

            sut.merge(target, source).should.deep.equal({foo: 'foo source'});
        });

        it('should override values for nested paths', function () {
            const target = {
                foo: {
                    bar: 'bar'
                }
            };
            const source = {
                foo: {
                    bar: 'bar source'
                }
            };

            sut.merge(target, source).should.deep.equal({foo: {bar: 'bar source'}});
        });

        it('should add values for non-existing paths', function () {
            const target = {
                foo: 'foo'
            };
            const source = {
                bar: 'bar'
            };

            sut.merge(target, source).should.deep.equal({foo: 'foo', bar: 'bar'});
        });

        it('should throw an error if source not given', function () {
            const target = {
                foo: 'foo'
            };

            function mergeNonExistingSource() {
                return sut.merge(target);
            }

            mergeNonExistingSource.should.throw();
        });

        it('should throw an error if target not given', function () {
            function mergeInNowExistingTarget() {
                return sut.merge();
            }

            mergeInNowExistingTarget.should.throw();
        });
    });

    describe('#inflate()', function () {
        it('should return an inflated object', function () {
            const object = {
                'foo.bar': 'bar'
            };

            sut.inflate(object).should.deep.equal({foo: {bar: 'bar'}});
        });

        it('should return the given object if not flattened', function () {
            const object = {
                foo: 'foo'
            };

            sut.inflate(object).should.deep.equal({foo: 'foo'});
        });

        it('should throw an error if object is not given', function () {
            function inflateWithNoObject() {
                return sut.inflate();
            }

            inflateWithNoObject.should.throw();
        });
    });
});
