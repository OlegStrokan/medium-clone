import { LoginDto } from './login.dto'

export interface RegistrationDto extends LoginDto {
    userName: string
    fullName: string
}
