/* eslint @typescript-eslint/ban-ts-ignore: 0 */

import { INVALID_TYPE_ERROR, AbstractModel } from '../src/AbstractModel';
import { Property } from '../src';

import { SomeClass } from './fixtures/SomeClass';
import { TestTypes } from './fixtures/TestTypes';
import { NoDecoratorClass } from './fixtures/NoDecoratorClass';
import { UserTypeFunction } from './fixtures/circular-reference/user-type-function';
import { UserInfoTypeFunction } from './fixtures/circular-reference/user-info-type-function';

describe('AbstractModel', () => {
    describe('constructor', () => {
        it('Should seed the instance of model', () => {
            const someClass = new SomeClass({
                id: 1,
                name: 'some name',
            });

            expect(someClass.id).toEqual(1);
            expect(someClass.name).toEqual('some name');
        });

        it('Should seed property with the appropriate type', () => {
            const test = new TestTypes({
                string: 'string',
                boolean: false,
                number: 1,
                object: {},
                date: new Date(),
                someClasses: [],
                someClass: {},
            });

            expect(typeof test.string).toEqual('string');
            expect(typeof test.boolean).toEqual('boolean');
            expect(typeof test.number).toEqual('number');
            expect(typeof test.object).toEqual('object');
            expect(test.date).toBeInstanceOf(Date);
            expect(Array.isArray(test.someClasses)).toBeTruthy();
            expect(test.someClass).toBeInstanceOf(SomeClass);
        });

        it('Should only seed the decorated properties of model', () => {
            const someClass = new SomeClass({
                notme: false,
            });

            expect(someClass.notme).toBeUndefined();
        });

        it('Should not seed the model when no data are provided', () => {
            const someClass = new SomeClass();

            expect(someClass.id).toBeUndefined();
            expect(someClass.name).toBeUndefined();
        });

        it('Should not seed the property when the value provided value for property is undefined or null', () => {
            const someClassUndefined = new SomeClass({
                id: undefined,
            });

            expect(someClassUndefined.id).toBeUndefined();

            const someClassNull = new SomeClass({
                // @ts-ignore Testing values that can be used at runtime
                id: null,
            });

            expect(someClassNull.id).toBeUndefined();
        });

        it('Should seed models recursively', () => {
            const testInstance = new TestTypes({
                number: 1,
                someClass: new SomeClass({
                    id: 2,
                    name: 'some class',
                }),
            });

            expect(testInstance).toEqual({
                number: 1,
                someClass: new SomeClass({
                    id: 2,
                    name: 'some class',
                }),
            });
        });

        it('Should do nothing when there is no defined property', () => {
            expect(new NoDecoratorClass({})).toEqual({});
        });

        it('Should not add a non defined property to the class provided a non defined property', () => {
            class TestNonDefined extends AbstractModel<TestNonDefined> {
                @Property()
                public id: number;
            }

            // @ts-ignore Bypassing partial to test injection of non required value
            const test = new TestNonDefined({ id: 1, unknown: 'I should not be seeded' });

            expect({ ...test }).toEqual({ id: 1 });
        });

        it('Should throw an error if provided data is not an object', () => {
            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass('toto')).toThrowError(INVALID_TYPE_ERROR);

            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass([])).toThrowError(INVALID_TYPE_ERROR);

            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass(new Date())).toThrowError(INVALID_TYPE_ERROR);
        });

        it('Should create a new instance of child class given a decorated property with a type function', () => {
            const user = new UserTypeFunction({
                id: 1,
                userInfo: {
                    id: 1,
                },
            });

            expect(user.userInfo).toBeInstanceOf(UserInfoTypeFunction);
        });

        it('Should create an array of class instance given a decorated property with a type function', () => {
            const instance = new TestTypes({
                someClasses: [
                    {
                        id: 1,
                        name: 'some class 1',
                    },
                    {
                        id: 2,
                        name: 'some class 2',
                    },
                ],
            });

            expect(instance.someClasses[0]).toBeInstanceOf(SomeClass);
        });

        it('Should create an array of class instance with only expected properties given a decorated property with a type function', () => {
            const instance = new TestTypes({
                someClasses: [
                    {
                        id: 1,
                        name: 'some class 1',
                        // @ts-ignore Testing unexpected value
                        invalid: 'test',
                    },
                    {
                        id: 2,
                        name: 'some class 2',
                    },
                ],
            });

            // @ts-ignore Testing unexpected value
            expect(instance.someClasses[0].invalid).toBeUndefined();
        });

        it('Should seed property from the key that have been specified with option name', () => {
            class TestCustomName extends AbstractModel<TestCustomName> {
                @Property({
                    name: 'uuid',
                })
                public id: string;
            }

            const instance = new TestCustomName({
                uuid: 'abcd-efgh-ijkl-mnop-qrst',
            });

            expect(instance.id).toEqual('abcd-efgh-ijkl-mnop-qrst');

            // @ts-ignore Testing unexpected value
            expect(instance.uuid).toBeUndefined();
        });

        it('Should not cast received value when option "ignoreCast" is enabled', () => {
            class TestIgnoreCast extends AbstractModel<TestIgnoreCast> {
                @Property({
                    name: 'uuid',
                    ignoreCast: true,
                })
                public id: any;
            }

            const instance = new TestIgnoreCast({
                uuid: 'abcd-efgh-ijkl-mnop-qrst',
            });

            expect(instance.id).toEqual('abcd-efgh-ijkl-mnop-qrst');
        });
    });

    describe('getMetadata', () => {
        it('Should return metadata of exposed properties', () => {
            class TestExposedProperties extends AbstractModel<TestExposedProperties> {
                @Property({
                    expose: true,
                })
                public id: string;
            }

            expect(new TestExposedProperties().getMetadata()).toEqual({
                id: {
                    reflectedType: String,
                    providedType: undefined,
                },
            });
        });

        it('Should not return metadata for non-exposed properties', () => {
            class TestExposedProperties extends AbstractModel<TestExposedProperties> {
                @Property()
                public id: string;
            }

            expect(new TestExposedProperties().getMetadata()).toEqual({});
        });

        it('Should not return metadata for non-decorated properties', () => {
            class TestExposedProperties extends AbstractModel<TestExposedProperties> {
                public id: string;
            }

            expect(new TestExposedProperties().getMetadata()).toEqual({});
        });
    });
});
