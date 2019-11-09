import "reflect-metadata";

import { Role } from "./model/Role";
import { User } from "./model/User";

const user = new User(
    {
        id: 1,
        name: "Foo",
        email: "foo@bar.foo",
        role: new Role(
            {
                id: 1,
                name: "Foo",
            }
        ),
    }
);

// tslint:disable-next-line
console.log(user);
