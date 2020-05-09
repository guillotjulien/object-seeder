/* istanbul ignore file */

import { Property, AbstractModel } from '../../../src';
import { UserInfoTypeFunction } from './user-info-type-function';

export class UserTypeFunction extends AbstractModel<UserTypeFunction> {
    @Property()
    public id: number;

    @Property(() => UserInfoTypeFunction)
    public userInfo: UserInfoTypeFunction;
}
