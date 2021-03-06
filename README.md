# Object Seeder
> Typescript utils for hassle free automatic object seeding. No more static mapping to maintain!

[![npm](https://img.shields.io/npm/v/object-seeder)](https://www.npmjs.com/package/object-seeder)
[![Build](https://img.shields.io/drone/build/guillotjulien/object-seeder?server=https%3A%2F%2Fdrone.nhvfc.xyz)](https://drone.nhvfc.xyz/guillotjulien/typescript-object-population)
[![DeepScan grade](https://deepscan.io/api/teams/8551/projects/10758/branches/153036/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8551&pid=10758&bid=153036)

Object Seeder is a set of two utils aiming to make model seeding efficient and easy again using the power of Typescript.
Your models will be used to determine where the data coming from the data source should be stored, without maintaining static mappings.

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

    @Property(() => Role)
    public role: Role;
}
```

And no longer like this:
``` typescript
export class User {
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

## Quick Start

This package only provide two things: the AbstractModel, and the decorator
Property. When implementing it in your models you only need to extends the
AbstractModel and decorates your properties with `@Property()`.

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

    @Property(() => Role)
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

## Handling Arrays and Relationships between classes

When dealing with arrays and relationships, the preferred way is to provides a
function that returns the relation class. While not mandatory, it helps the
AbstractModel to seeds our models without adding non expected properties, which
would otherwise be impossible due to language specifics. If not provided, the
fallback will be a generic object, and as such, any property can be seeded in
the model.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property()
    public id: number;

    @Property(() => Role)
    public roles: Role[]; // An array of roles
}
```

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property()
    public id: number;

    @Property(() => Role)
    public role: Role;
}
```

## Retrieving Class Metadata

Exposed properties can be retrieved using the method `getMetadata()`.
This method return an array of metadata about the exposed properties such as the
reflected type and the type that have been directly provided to the decorator.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property(() => Role, {
        expose: true,
    })
    public role: Role;
}

const user = new User();

console.log(user.getMetadata()); // [ id: { reflectedType: undefined, providedType: Role } ]
```

## Decorator Options

Those options can be provided to the `@Property` decorator to fine tune its
behavior.

### name

The name option is to be used when the name of the property in the data source
(e.g. database) differ from the one you want to use in your model. Provided with
the name of the property in the data source, it will automatically associate the
data with its property in the model.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property({
        name: 'uuid',
    })
    public id: number;
}

const user = new User({
    uuid: 1,
});

console.log(user.id); // 1
```

### ignoreCast

If true, the reflected / provided type will not be used, and the value will be
returned as received.

This is particularly useful when the data type is `any` because the reflected
type in this case will be `Object` which is not always what we want.

By default, received values will always be cast.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property({
        ignoreCast: true,
    })
    public id: any;
}

const user = new User({
    id: 'very-unique-id',
});

console.log(user.id); // 'very-unique-id'
```

### expose

If true, property metadata will be returned by getMetadata method. By default,
no property metadata are exposed.

``` typescript
import { AbstractModel, Property } from 'object-seeder';

export class User extends AbstractModel<User> {
    @Property({
        expose: true,
    })
    public id: string;
}

const user = new User();

console.log(user.getMetadata()); // [ id: { reflectedType: String, providedType: undefined } ]
```

## TODO

- [ ] Replace AbstractModel by another decorator
- [ ] Add custom example (select options based on model properties)
- [ ] Contributor guidelines
    - [ ] Branch naming rules
    - [ ] Commit naming rules
    - [ ] Code of conduct

## Contributing

Interested in contributing features and fixes? All contributions are welcome :smiley:

Make sure to follow these step, or your contribution might be rejected.

1. Fork it (https://github.com/yourname/yourproject/fork)
2. Create your feature branch (git checkout -b feature/fooBar)
3. If your changes impact the public API, make sure to add more tests and run the old ones
5. Commit your changes (git commit -am 'Add some fooBar')
4. Push to the branch (git push origin feature/fooBar)
5. Open a new Pull Request against `develop` following our contributor guidelines

## License

This project is under the MIT License. See the [LICENSE](https://github.com/guillotjulien/object-seeder/blob/master/LICENCE.md) file for the full license text.
