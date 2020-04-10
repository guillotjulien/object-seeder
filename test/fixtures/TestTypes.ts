import { AbstractModel } from "../../src/AbstractModel";
import { SomeClass } from "./SomeClass";
import { Property } from "../../src/Property";

export class TestTypes extends AbstractModel<TestTypes> {
    @Property()
    public string: string;

    @Property()
    public boolean: boolean;

    @Property()
    public number: number;

    @Property()
    public object: Record<string, any>;

    @Property()
    public date: Date;

    @Property()
    public someClasses: SomeClass[];

    @Property()
    public someClass: SomeClass;
}
