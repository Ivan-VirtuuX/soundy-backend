import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @Length(6, 32, { message: 'Длина пароля должна быть минимум 6 символов' })
  password?: string;

  @IsEmail(undefined, { message: 'Неверный логин или пароль' })
  login: string;
}
