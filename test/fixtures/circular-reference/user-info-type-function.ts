/* istanbul ignore file */

import { Property, AbstractModel } from '../../../src';
import { UserTypeFunction } from './user-type-function';

export class UserInfoTypeFunction extends AbstractModel<UserInfoTypeFunction> {
    @Property()
    public id: number;

    @Property(() => UserTypeFunction)
    public user: UserTypeFunction;
}
