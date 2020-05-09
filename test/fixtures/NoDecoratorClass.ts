/* istanbul ignore file */

import { AbstractModel } from '../../src/AbstractModel';

export class NoDecoratorClass extends AbstractModel<NoDecoratorClass> {
    public id: number;

    public name: string;

    constructor(data?: any) {
        super(data);
    }
}
