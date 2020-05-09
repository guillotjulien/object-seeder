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
                type: undefined,
            },
            number: {
                reflectedType: Number,
                type: undefined,
            },
            bigInt: {
                reflectedType: BigInt,
                type: undefined,
            },
            string: {
                reflectedType: String,
                type: undefined,
            },
            symbol: {
                reflectedType: Symbol,
                type: undefined,
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
                type: undefined,
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
                type: undefined,
            },
            user: {
                reflectedType: Object,
                type: undefined,
            },
        });

        expect(Reflect.getMetadata(PARAMETER_KEY, new User())).toEqual({
            id: {
                reflectedType: Number,
                type: undefined,
            },
            userInfo: {
                reflectedType: UserInfo,
                type: undefined,
            },
        });
    });

    it('Should reflect provided type given a decorated class property with a type function', () => {
        const userInfoProperties = Reflect.getMetadata(PARAMETER_KEY, new UserInfoTypeFunction());
        const userProperties = Reflect.getMetadata(PARAMETER_KEY, new UserTypeFunction());

        expect(userInfoProperties.user).toEqual({
            reflectedType: UserTypeFunction,
            runtimeType: expect.any(Function),
        });

        expect(userProperties.userInfo).toEqual({
            reflectedType: Object,
            runtimeType: expect.any(Function),
        });
    });
});
