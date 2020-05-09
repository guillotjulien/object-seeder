/* istanbul ignore file */

import { Property } from '../../../src';
import { UserTypeFunction } from './user-type-function';

export class UserInfoTypeFunction {
    @Property()
    public id: number;

    @Property(() => UserTypeFunction)
    public user: UserTypeFunction;
}
