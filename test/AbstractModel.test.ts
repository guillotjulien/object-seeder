import { SomeClass } from "./fixtures/SomeClass";
import { TestTypes } from "./fixtures/TestTypes";
import { NoDecoratorClass } from "./fixtures/NoDecoratorClass";
import { INVALID_TYPE_ERROR } from "../src/AbstractModel";

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

            expect(testInstance.number).toEqual(1);
            expect(testInstance.someClass.id).toEqual(2);
            expect(testInstance.someClass.name).toEqual('some class');
        });

        // TODO: Add test to see how it react when trying to populate an unknow sub child

        it('Should do nothing when there is no defined property', () => {
            expect(new NoDecoratorClass({})).toEqual({});
        });

        it('Should throw an error if provided data is not an object', () => {
            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass('toto')).toThrowError(INVALID_TYPE_ERROR);

            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass([])).toThrowError(INVALID_TYPE_ERROR);

            // @ts-ignore Testing values that can be used at runtime
            expect(() => new SomeClass(new Date())).toThrowError(INVALID_TYPE_ERROR);
        });
    });
});
