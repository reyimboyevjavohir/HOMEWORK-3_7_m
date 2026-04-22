import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Yangi foydalanuvchi ro'yxatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi yaratildi, OTP emailga yuborildi',
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ma'lumot" })
  @ApiResponse({ status: 409, description: 'Email allaqachon mavjud' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'OTP kodni tasdiqlash' })
  @ApiResponse({ status: 200, description: 'Akkaunt faollashtirildi' })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri yoki muddati o'tgan OTP",
  })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({ status: 200, description: 'JWT token qaytarildi' })
  @ApiResponse({ status: 401, description: "Email yoki parol noto'g'ri" })
  @ApiResponse({ status: 403, description: 'Akkaunt faollashtirılmagan' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchilar ro'yxati",
    type: [User],
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  @ApiParam({ name: 'id', example: 1, description: 'Foydalanuvchi ID si' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi topildi',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  @ApiParam({ name: 'id', example: 1, description: 'Foydalanuvchi ID si' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi yangilandi',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
  @ApiParam({ name: 'id', example: 1, description: 'Foydalanuvchi ID si' })
  @ApiResponse({ status: 200, description: "Foydalanuvchi o'chirildi" })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
