import { ApiProperty } from '@nestjs/swagger';

export class DecodeTokenDto {
    @ApiProperty({ example: '2093' })
    userId: string;
}
