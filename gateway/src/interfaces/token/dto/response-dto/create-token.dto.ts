import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
    @ApiProperty({ example: '09efjwfp9e823dyrd239d2j389d23dj2' })
    value: string;
}
