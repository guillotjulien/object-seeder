import { AbstractModel } from "../helpers/class/AbstractModel";
import { Property } from "../helpers/decorators/Property";
import { Role } from "./Role";

export class User extends AbstractModel {

    @Property()
    public id: number;

    @Property()
    public name: string;

    @Property()
    public email: string;

    @Property()
    public role: Role;

    constructor(props?: any) {
        super(props);
    }
}
