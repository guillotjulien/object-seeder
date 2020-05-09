import 'reflect-metadata';

/**
 * Key used to register type metadata in the class instance at runtime.
 */
export const PARAMETER_KEY = 'model:properties';

/**
 * This is the @Property() decorator factory. This decorator, used on a class property,
 * retrieve the name and type of the property and add them to the class metadata.
 *
 * @param type Type function used to define a custom type. This parameter is used
 * to bypass current reflection API limitations where type cannot be reflected for
 * circular references.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/4521|Issue} for further information.
 *
 * @example
 * // Results in { stringProperty: [Function: String] }
 * class Example {
 *      @Property()
 *      public stringProperty: string;
 * }
 *
 * @example
 * // Results in { userInfo: [Function: anonymous] }
 * class Example {
 *      @Property(() => UserInfo)
 *      public userInfo: string;
 * }
 *
 * Beware that with this decorator, a private property can be seeded as well,
 * since typescript visibility doesn't exists at runtime.
 *
 * Null and Undefined are a special case. They are primitive types, but when reflected,
 * they will always result in 'undefined'. I fell like this is not an issue given
 * the use of these values as a type annotation, but it should be noted.
 *
 * @returns An instance of the decorator
 */
export function Property(type?: () => Function): Function {
    return (target: Record<string, any>, property: string): void => {
        const reflectedType = Reflect.getMetadata('design:type', target, property);
        const existingParameters = Reflect.getMetadata(PARAMETER_KEY, target) || {};

        Reflect.defineMetadata(
            PARAMETER_KEY,
            {
                ...existingParameters,
                [property]: {
                    // Workaround for this issue: https://github.com/microsoft/TypeScript/issues/4521
                    reflectedType: reflectedType || Object,
                    runtimeType: type,
                },
            },
            target,
        );
    };
}
