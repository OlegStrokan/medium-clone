import {ApiProperty} from "@nestjs/swagger";

export class IUser {
    @ApiProperty({ example: "129"})
    id: string;

    @ApiProperty({ example: "Oleh Strokan"})
    fullName: string

    @ApiProperty({ example: "stroka01"})
    userName: string

    @ApiProperty({ example: "oleg14ua71@gmail.com"})
    email: string;

    @ApiProperty({ example: "w09a8rj32831he018h108eh29d8e2jd"})
    password?: string;

    @ApiProperty({ example: "http://localhost:8000/28jr28ewj092j93rd02r23hrd"})
    activationLink: { link: string };
}
