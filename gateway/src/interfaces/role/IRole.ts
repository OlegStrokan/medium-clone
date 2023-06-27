import { ApiProperty } from '@nestjs/swagger';

export class IRole {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: 'Admin' })
    value: string;

    @ApiProperty({ example: 'Administrator role with full access' })
    description: string;
}
