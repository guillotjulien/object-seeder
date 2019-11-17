import "reflect-metadata";

/**
 * Base model to extends when creating a new model
 */
export abstract class AbstractModel {
    /**
     * Populate model with data
     *
     * @param props Data to populate model with
     */
    constructor(props?: any) {
        if (!props) {
            return;
        }

        const properties = this.getProperties();

        if (!properties) {
            throw new Error("Model without properties cannot be automatically populated. Did you forget to use @Property()?");
        }

        for (const key in props) {
            const camelCaseKey = this.snakeCaseToCamelCase(key);

            if (properties.hasOwnProperty(camelCaseKey)) {
                const value = props[key];
                const type = properties[camelCaseKey];

                Object.defineProperty(this, camelCaseKey, {
                    value: this.transformValue(value, type),
                    configurable: true,
                    enumerable: true,
                    writable: true
                });
            }
        }
    }

    /**
     * Return all registered properties of a class
     *
     * @returns An array of all properties registered with @Property() decorator
     */
    protected getProperties(): any {
        return Reflect.getMetadata(Symbol.for("model:properties"), this);
    }

    /**
     * Transform value to the appropriate type. If it's a primitive type it will only be casted to this value.
     * Otherwise, an object matching type will be returned.
     *
     * @param value
     * @param type
     */
    private transformValue(value: any, type: any): any {
        const primitiveTypes = ["Number", "String", "Boolean"];

        if (primitiveTypes.indexOf(type.name) !== -1) {
            return type(value);
        } else if (type.name === "Symbol") {
            return value;
        }

        return new type(value);
    }

    /**
     * Convert a snake_case string to camelCase
     *
     * @param value The string to convert
     *
     * @returns The string converted to camelCase
     */
    private snakeCaseToCamelCase(value: string): string {
        return value
            .replace(/(?<=_)./g, (selected) => selected.toUpperCase())
            .replace(/_/g, "");
    }
}
