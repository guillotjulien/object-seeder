import 'reflect-metadata';

export const INVALID_TYPE_ERROR = 'Provided data must be of object type.';
export const UNDEFINED_TYPE_ERROR = 'Cannot convert value to undefined type.';

/**
 * Base model to extends when creating a new model. This class provides the
 * mecanisme for automatic object seeding.
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
     * FIXME: replace any by interface
     *
     * @returns An array containing all properties with their type.
     */
    private getProperties(): any {
        return Reflect.getMetadata('model:properties', this);
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
    private transformValue(value: any, type: any): any {
        const primitiveTypes = ['Number', 'String', 'Boolean'];

        // We want to keep falsy values
        if (value === undefined || value === null) {
            return;
        }

        if (!type) {
            throw new Error(UNDEFINED_TYPE_ERROR);
        }

        if (primitiveTypes.indexOf(type.name) >= 0) {
            return type(value);
        } else if (type.name === 'Array' && Array.isArray(value)) {
            return Array.from(value);
        }

        return new type(value);
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
