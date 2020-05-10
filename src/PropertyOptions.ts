/**
 * Interface describing every options that can be provided to the Property
 * decorator.
 */
export interface PropertyOptions {
    /**
     * Specify a custom property name when the name of the property in the data
     * source differ from the one in our internal models. It'll ensure the
     * specified key is seeded in the right property.
     */
    name?: string;

    /**
     * If true, the data source properties names will be converted to camel
     * case.
     */
    camelCase?: boolean;

    /**
     * If true, the reflected / provided type will not be used, and the value
     * will be returned as received.
     *
     * This is particularly useful when the data type is "any" because the
     * reflected type in this case will be "Object" which is not always what we
     * want.
     *
     * By default, received values will always be cast.
     */
    ignoreCast?: boolean;
}
