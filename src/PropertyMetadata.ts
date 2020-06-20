import { PropertyOptions } from './PropertyOptions';

/**
 * PropertyMetadata describe the information about the type of the property that
 * have been obtained with the Property decorator and the options that have been
 * supplied.
 */
export interface PropertyMetadata {
    /**
     * The type that was obtained through reflection. For primitive types
     * (except null and undefined), this is enough to properly cast the value.
     * In case the type cannot be reflected, the fallback will always be Object.
     */
    reflectedType: any;

    /**
     * A complementary type that can be provided with the type option of the
     * Property decorator. This is used to obtain more precise information about
     * the property type in case it cannot be reflected, or for array for
     * example.
     */
    providedType?: any;

    /**
     * options used to fine tune behavior of Property decorator.
     */
    options?: PropertyOptions;
}
