/* istanbul ignore file */

import { Property } from '../../../src';
import { User } from './user';

export class UserInfo {
    @Property()
    public id: number;

    @Property()
    public user: User;
}
