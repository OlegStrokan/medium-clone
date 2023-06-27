import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/response-dto/get-user.dto';

export class LoginReturnDto extends GetUserDto {
    @ApiProperty({ example: 'abcxyz123', description: 'Access token' })
    token: string;
}
