import { PropertyOptions } from './PropertyOptions';
import { ExposedPropertyMetadata } from './ExposedPropertyMetadata';

/**
 * PropertyMetadata describe the information about the type of the property that
 * have been obtained with the Property decorator and the options that have been
 * supplied.
 */
export interface PropertyMetadata extends ExposedPropertyMetadata {
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
