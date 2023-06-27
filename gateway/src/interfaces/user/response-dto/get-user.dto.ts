import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../IUser';
import { ISubscription } from '../../subscriptions/ISubscription';
import { IRole } from '../../role/IRole';

export class GetUserDto {
    @ApiProperty({ type: () => IUser })
    user: IUser;

    @ApiProperty({ type: () => [ISubscription] })
    subscriptions?: ISubscription[];

    @ApiProperty({ type: () => [IRole] })
    roles?: IRole[];
}
