import 'reflect-metadata';

/**
 * This is the @Property() decorator factory. This decorator, used on a class property,
 * retrieve the name and type of the property and add them to the class metadata.
 *
 * FIXME: Explain the Object workaround and what it can imply
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/4521|Issue} for further information.
 *
 * @example
 * // Results in { stringProperty: string }
 * class Example {
 *      @Property()
 *      public stringProperty: string;
 * }
 *
 * Beware that with this decorator, a private property can be seeded as well,
 * since typescript visibility doesn't exists at runtime.
 *
 * @returns An instance of the decorator
 */
export function Property(typeFunction?: () => Function): Function {
    return (target: Record<string, any>, property: string): void => {
        const reflectedType = Reflect.getMetadata('design:type', target, property);
        const existingParameters = Reflect.getMetadata('model:properties', target);

        // console.log(reflectedType, typeof reflectedType, typeFunction ? typeFunction() : undefined);

        if (!existingParameters) {
            Reflect.defineMetadata(
                'model:properties',
                {
                    // Workaround for this issue: https://github.com/microsoft/TypeScript/issues/4521
                    [property]: reflectedType || Object,
                },
                target,
            );
        } else {
            // Update existing metadata
            Reflect.defineMetadata(
                'model:properties',
                {
                    ...existingParameters,
                    [property]: reflectedType || Object,
                },
                target,
            );
        }
    };
}
