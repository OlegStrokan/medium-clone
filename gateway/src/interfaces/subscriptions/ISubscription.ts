import { ApiProperty } from '@nestjs/swagger';

export class ISubscription {
    @ApiProperty({ example: '2039' })
    id: string;

    @ApiProperty({ example: 'basic' })
    value: string;

    @ApiProperty({ example: 'Basic subscription' })
    description: string;

    @ApiProperty({ example: '10.99' })
    monthPrice: string;

    @ApiProperty({ example: '99.99' })
    yearPrice: string;
}
