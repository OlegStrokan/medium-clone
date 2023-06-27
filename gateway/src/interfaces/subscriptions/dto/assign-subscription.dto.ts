import { ApiProperty } from '@nestjs/swagger';

export class AssignSubscriptionDto {
    @ApiProperty({ example: '609d10e3ab3cde001f2f2a12' })
    userId: string;

    @ApiProperty({ example: '609d10e3ab3cde001f2f2a34' })
    subscriptionId: string;
}
