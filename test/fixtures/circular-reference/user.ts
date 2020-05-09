import { Property } from '../../../src';
import { UserInfo } from './user-info';

export class User {
    @Property()
    public id: number;

    @Property()
    public userInfo: UserInfo;
}
