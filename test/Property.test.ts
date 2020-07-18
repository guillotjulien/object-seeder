import { PARAMETER_KEY, Property } from '../src';
import { User } from './fixtures/circular-reference/user';
import { UserInfo } from './fixtures/circular-reference/user-info';
import { UserInfoTypeFunction } from './fixtures/circular-reference/user-info-type-function';
import { UserTypeFunction } from './fixtures/circular-reference/user-type-function';

describe('Property decorator', () => {
    it('Should not return metadata matching key "PARAMETER_KEY" given a non decorated class', () => {
        class NonDecoratedClass {
            public id: number;

            public name: string;
        }

        expect(Reflect.getMetadata(PARAMETER_KEY, new NonDecoratedClass())).toBeUndefined();
    });

    it('Should reflect primitive types given a decorated class property', () => {
        class TestPrimitive {
            @Property()
            public boolean: boolean;

            @Property()
            public number: number;

            @Property()
            public bigInt: bigint;

            @Property()
            public string: string;

            @Property()
            public symbol: symbol;
        }

        expect(Reflect.getMetadata(PARAMETER_KEY, new TestPrimitive())).toEqual({
            boolean: {
                reflectedType: Boolean,
                options: undefined,
                realName: 'boolean',
            },
            number: {
                reflectedType: Number,
                options: undefined,
                realName: 'number',
            },
            bigInt: {
                reflectedType: BigInt,
                options: undefined,
                realName: 'bigInt',
            },
            string: {
                reflectedType: String,
                options: undefined,
                realName: 'string',
            },
            symbol: {
                reflectedType: Symbol,
                options: undefined,
                realName: 'symbol',
            },
        });
    });

    it('Should reflect custom types given a decorated class property', () => {
        class CustomType {
            public id: number;
        }

        class TestCustomType {
            @Property()
            public customType: CustomType;
        }

        expect(Reflect.getMetadata(PARAMETER_KEY, new TestCustomType())).toEqual({
            customType: {
                reflectedType: CustomType,
                providedType: undefined,
                options: undefined,
                realName: 'customType',
            },
        });
    });

    /**
     * This test purpose is to fail one day. I still hope that JS Reflection API
     * will mature and that we'll be able to reflect types in 100% of the cases.
     *
     * This test is kind of black magic (or not if we read the resulting source code),
     * the known class will be the last imported one.
     */
    it('Should default to Object given a decorated class property whose type is not identifiable', () => {
        expect(Reflect.getMetadata(PARAMETER_KEY, new UserInfo())).toEqual({
            id: {
                reflectedType: Number,
                providedType: undefined,
                options: undefined,
                realName: 'id',
            },
            user: {
                reflectedType: Object,
                providedType: undefined,
                options: undefined,
                realName: 'user',
            },
        });

        expect(Reflect.getMetadata(PARAMETER_KEY, new User())).toEqual({
            id: {
                reflectedType: Number,
                providedType: undefined,
                options: undefined,
                realName: 'id',
            },
            userInfo: {
                reflectedType: UserInfo,
                providedType: undefined,
                options: undefined,
                realName: 'userInfo',
            },
        });
    });

    it('Should reflect provided type given a decorated class property with a type function', () => {
        const userInfoProperties = Reflect.getMetadata(PARAMETER_KEY, new UserInfoTypeFunction());
        const userProperties = Reflect.getMetadata(PARAMETER_KEY, new UserTypeFunction());

        expect(userInfoProperties.user).toEqual({
            reflectedType: UserTypeFunction,
            providedType: expect.any(Function),
            options: undefined,
            realName: 'user',
        });

        expect(userProperties.userInfo).toEqual({
            reflectedType: Object,
            providedType: expect.any(Function),
            options: undefined,
            realName: 'userInfo',
        });
    });
});
