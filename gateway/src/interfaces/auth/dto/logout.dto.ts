import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LogoutDto {
    @ApiProperty({ example: 'abc123', description: 'User ID' })
    @IsString({ message: 'Id must be a string' })
    @IsNotEmpty({ message: 'Id can\'t be empty' })
    @Transform(({ value }) => value.toLowerCase())
    id: string;
}
