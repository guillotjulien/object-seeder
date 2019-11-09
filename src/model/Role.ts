import { AbstractModel } from "../helpers/class/AbstractModel";
import { Property } from "../helpers/decorators/Property";

export class Role extends AbstractModel {

    @Property()
    public id: number;

    @Property()
    public name: string;

    constructor(props?: any) {
        super(props);
    }
}
