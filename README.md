# Object Seeder
> Typescript utils for hassle free automatic object seeding. No more static mapping to maintain!

[![npm](https://img.shields.io/npm/v/object-seeder)](https://www.npmjs.com/package/object-seeder)
[![Build Status](https://drone.nhvfc.xyz/api/badges/guillotjulien/typescript-object-population/status.svg)](https://drone.nhvfc.xyz/guillotjulien/typescript-object-population)
[![DeepScan grade](https://deepscan.io/api/teams/8551/projects/10758/branches/153036/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8551&pid=10758&bid=153036)

Object Seeder is a set of two utils aiming to make model seeding efficient and easy again using the power of Typescript.
No need to have these ugly static methods in your models, and the bugs that comes with that.

With Object Seeder, your models look like this:
``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property()
    public id: number;

    @Property()
    public firstName: string;

    @Property()
    public lastName: string;

    @Property()
    public age: number;

    @Property()
    public role: Role;
}
```

And no longer like this:
``` typescript
export class User extends AbstractModel<User> {
    public id: number;

    public firstName: string;

    public lastName: string;

    public age: number;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.age = data.age;
        this.role = new Role(data.role);
    }
}
```

## Installation

1. Install the npm package
`npm install object-seeder`

2. Install `reflect-metadata` shim
`npm install reflect-metadata`

3. TypeScript configuration
Make sure you have the following settings enabled in your `tsconfig.json`

``` json
{
    "compilerOptions": {
        "target": "es6",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}
```

## Usage Example

This package only provide two things: the AbstractModel, and the decorator Property. When implementing it in your models
you only need to extends the AbstactModel and decorate your properties with `@Property()`. After that, our little friend
reflection will take care of the rest.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property()
    public id: number;

    @Property()
    public firstName: string;

    @Property()
    public lastName: string;

    @Property()
    public age: number;

    @Property()
    public role: Role;
}

const user = new User({
    id: 1,
    firstName: 'foo',
    lastName: 'bar',
    age: 35,
    role: {
        id: 1,
        name: 'superadmin',
    },
});
```

## TODO

- [] Optionnal automatic conversion from snake_Case to camelCase
- [] Provide a custom name as a parameter for customized seeding
- [] Replace AbstractModel by another decorator
- [] Add custom example (select options based on model properties)

## Contributing

Interested in contributing features and fixes? All contributions are welcome :smiley:
Make sure to follow these step, or your contribution might be rejected.

1. Fork it (https://github.com/yourname/yourproject/fork)
2. Create your feature branch (git checkout -b feature/fooBar)
3. If your changes impact the public API, make sure to add more tests and run the old ones
5. Commit your changes (git commit -am 'Add some fooBar')
4. Push to the branch (git push origin feature/fooBar)
5. Open a new Pull Request

## License

This project is under the MIT License. See the [LICENSE](https://github.com/guillotjulien/object-seeder/blob/master/LICENCE.md) file for the full license text.
