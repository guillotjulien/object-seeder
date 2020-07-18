/**
 * ExposedPropertyMetadata describes the information about the type of the
 * property that have been obtained with the Property decorator.
 */
export interface ExposedPropertyMetadata {
    /**
     * The type that was obtained through reflection. For primitive types
     * (except null and undefined), this is enough to properly cast the value.
     * In case the type cannot be reflected, and no support type is provided,
     * the fallback will always be Object.
     */
    readonly reflectedType: any;

    /**
     * A complementary type that can be provided with the type option of the
     * Property decorator. This is used to obtains more precise information
     * about the property type in case it cannot be reflected, or for array for
     * example.
     */
    readonly providedType?: any;
}
