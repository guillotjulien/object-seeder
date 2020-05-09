/* istanbul ignore file */

import { Property } from '../../../src';
import { UserInfoTypeFunction } from './user-info-type-function';

export class UserTypeFunction {
    @Property()
    public id: number;

    @Property(() => UserInfoTypeFunction)
    public userInfo: UserInfoTypeFunction;
}
