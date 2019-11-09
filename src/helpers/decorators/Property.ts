import "reflect-metadata";

/**
 * Get property name and type and add them to class metadata
 *
 * @param customType Only used for Symbol
 */
export function Property(customType?: any) {
    // ensure data uniqueness
    const propertiesSymbol = Symbol.for("model:properties");

    return (target: any, property: any) => {
        const type = customType ? customType : Reflect.getMetadata("design:type", target, property);
        const existingParameters = Reflect.getMetadata(propertiesSymbol, target);

        if (!existingParameters) {
            Reflect.defineMetadata(propertiesSymbol, {
                [property]: type,
            }, target);
        } else {
            Reflect.defineMetadata(propertiesSymbol, {
                ...existingParameters,
                [property]: type,
            }, target);
        }
    };
}
