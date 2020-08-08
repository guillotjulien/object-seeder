import { PARAMETER_KEY } from './Property';
import { ExposedPropertyMetadata } from './ExposedPropertyMetadata';
import { PropertyOptions } from './PropertyOptions';

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
     * @throws Provided data is not an object
     */
    constructor(data?: RecursivePartial<T> & GenericKey) {
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
                let value = data[key];
                const metadata = properties[key];

                if (metadata && (!metadata.options || !metadata.options.ignoreCast)) {
                    value = this.transformValue(value, metadata);
                }

                Object.defineProperty(this, metadata.realName, {
                    value: value,
                    configurable: true,
                    enumerable: true,
                    writable: true,
                });
            }
        }
    }

    /**
     * Get exposed properties and their type. This only works for properties
     * that have been decorated with the @Property() decorator.
     *
     * @returns An array containing metadata of exposed properties.
     */
    public getMetadata(): ObjectMetadata {
        const properties = this.getProperties();
        const exposedProperties = {};

        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const element = properties[key];

                if (element.options && element.options.expose) {
                    Object.assign(exposedProperties, {
                        [element.realName]: {
                            reflectedType: element.reflectedType,
                            providedType: element.providedType,
                        },
                    });
                }
            }
        }

        return Object.assign({}, exposedProperties);
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
     * Transform value to the appropriate type. If it's a primitive type it
     * will only be casted to this value. Otherwise, an object matching type
     * will be returned.
     *
     * @param value Value to transform
     * @param metadata Information retrieved about the property
     *
     * @throws No value was provided
     * @throws No cast type was provided
     *
     * @returns converted value
     */
    private transformValue(value: any, metadata: PropertyMetadata): any {
        // We want to keep falsy values
        if (value === undefined || value === null) {
            return;
        }

        let { reflectedType, providedType } = metadata;
        const primitiveTypes = ['Number', 'String', 'Boolean'];

        if (!reflectedType && !providedType) {
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

/**
 * PropertyMetadata describe the information about the type of the property that
 * have been obtained with the Property decorator and the options that have been
 * supplied.
 */
interface PropertyMetadata extends ExposedPropertyMetadata {
    /**
     * Real name of the property. This is used when user provide a custom name
     * for the property in the options when property name in the data source
     * differ from the one in the model.
     */
    readonly realName: string;

    /**
     * options used to fine tune behavior of Property decorator.
     */
    readonly options?: PropertyOptions;
}

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

type GenericKey = {
    [key: string]: any;
};

type ObjectKeyMetadata = {
    [key: string]: PropertyMetadata;
};

type ObjectMetadata = {
    [key: string]: ExposedPropertyMetadata;
};
