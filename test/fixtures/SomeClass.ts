/* istanbul ignore file */

import { AbstractModel } from '../../src/AbstractModel';
import { Property } from '../../src/Property';

export class SomeClass extends AbstractModel<SomeClass> {
    @Property()
    public id: number;

    @Property()
    public name: string;

    public notme: boolean;
}
