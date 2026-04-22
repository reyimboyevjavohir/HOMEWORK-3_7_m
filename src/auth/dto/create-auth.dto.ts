import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: 'Secret123!',
    description: 'Parol (kamida 8 ta belgi)',
  })
  @IsString()
  @IsNotEmpty()
  declare password: string;

  @ApiProperty({ example: 'ali_karimov', description: 'Foydalanuvchi nomi' })
  @IsString()
  declare username: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Tasdiqlash uchun email',
  })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: '123456', description: 'Emailga yuborilgan OTP kod' })
  @IsString()
  @IsNotEmpty()
  declare otp: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email manzil' })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: 'Secret123!', description: 'Parol' })
  @IsString()
  @IsNotEmpty()
  declare password: string;
}
