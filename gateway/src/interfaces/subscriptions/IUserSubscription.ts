import { ApiProperty } from '@nestjs/swagger';

export class IUserSubscription {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: '123456789' })
    userId: string;

    @ApiProperty({ example: '987654321' })
    subscriptionId: string;
}
