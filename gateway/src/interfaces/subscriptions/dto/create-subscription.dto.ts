import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
    @ApiProperty({ example: 'Premium' })
    value: string;

    @ApiProperty({ example: 'Access to premium features' })
    description: string;

    @ApiProperty({ example: '9.99' })
    monthPrice: string;

    @ApiProperty({ example: '99.99' })
    yearPrice: string;
}
