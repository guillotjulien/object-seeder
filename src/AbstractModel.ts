import { PARAMETER_KEY } from './Property';
import { PropertyType } from './PropertyType';

export const INVALID_TYPE_ERROR = 'Provided data must be of object type.';
export const UNDEFINED_TYPE_ERROR = 'Cannot convert value to undefined type.';

/**
 * Base model to extends when creating a new model. This class provides the
 * mechanism for automatic object seeding.
 */
export abstract class AbstractModel<T> {
    /**
     * Populate model with data
     *
     * @param data Data to populate model with
     *
     * @throws When provided data is not an object
     */
    constructor(data?: RecursivePartial<T>) {
        const properties = this.getProperties();

        // Nothing to do if there is no data or no properties defined
        if (!data || !properties) {
            return;
        }

        if (!this.isObject(data)) {
            throw new Error(INVALID_TYPE_ERROR);
        }

        for (const key in data) {
            if (properties.hasOwnProperty(key)) {
                const value = data[key];
                const type = properties[key];

                Object.defineProperty(this, key, {
                    value: this.transformValue(value, type),
                    configurable: true,
                    enumerable: true,
                    writable: true,
                });
            }
        }
    }

    /**
     * Get all the properties and their type. This only works for properties
     * that have been decorated with the @Property() decorator.
     *
     * @returns An array containing all properties with their type.
     */
    private getProperties(): ObjectKeyMetadata {
        return Reflect.getMetadata(PARAMETER_KEY, this);
    }

    /**
     * Transform value to the appropriate type. If it's a primitive type it will only be casted to this value.
     * Otherwise, an object matching type will be returned.
     *
     * @param value Value to transform
     * @param type Desired type for cast
     *
     * @throws Error when no value was provided
     * @throws Error when no cast type was provided
     *
     * @returns converted value
     */
    private transformValue(value: any, type: PropertyType): any {
        let { reflectedType, providedType } = type;
        const primitiveTypes = ['Number', 'String', 'Boolean'];

        // We want to keep falsy values
        if (value === undefined || value === null) {
            return;
        }

        if (!type) {
            throw new Error(UNDEFINED_TYPE_ERROR);
        }

        if (primitiveTypes.indexOf(reflectedType.name) >= 0) {
            return reflectedType(value);
        }

        if (reflectedType.name === 'Array' && Array.isArray(value)) {
            if (providedType) {
                reflectedType = providedType();

                return value.map((element) => new reflectedType(element));
            }

            // Fallback, unwanted properties can be included in the array
            return Array.from(value);
        }

        // When type was provided as an arrow function, the type is obtained at
        // runtime vs at initialization.
        if (providedType && !providedType.name) {
            reflectedType = providedType();
        }

        return new reflectedType(value);
    }

    private isObject(value: any): boolean {
        return (
            typeof value === 'object' &&
            !!value &&
            !Array.isArray(value) &&
            Object.prototype.toString.call(value) === '[object Object]'
        );
    }
}

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

type ObjectKeyMetadata = {
    [key: string]: PropertyType;
};
