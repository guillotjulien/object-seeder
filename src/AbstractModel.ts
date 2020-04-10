import 'reflect-metadata';

/**
 * Base model to extends when creating a new model. This class provides the
 * mecanisme for automatic object seeding.
 */
export abstract class AbstractModel {
    /**
     * Populate model with data
     *
     * @param data Data to populate model with
     */
    constructor(data?: any) {
        const properties = this.getProperties();

        // Nothing to do if there is no data
        if (!data) {
            return;
        }

        // TODO: Little util for object detection, otherwise, we could inject array, date, etc
        if (typeof data !== 'object') {
            throw new Error('Provided data must be of object type.');
        }

        if (!properties) {
            throw new Error(
                'Model without properties cannot be automatically populated. Did you forget to use @Property()?',
            );
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
        return Reflect.getMetadata(Symbol.for('model:properties'), this);
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
            return null;
        }

        if (!type) {
            throw new Error('Cannot convert value to undefined type.');
        }

        if (primitiveTypes.indexOf(type.name) >= 0) {
            return type(value);
        } else if (type.name === 'Array' && Array.isArray(value)) {
            return Array.from(value);
        }

        return new type(value);
    }
}
