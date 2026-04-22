import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { CreateAuthDto, LoginDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const candidate = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });

    if (candidate) {
      throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const user = this.userRepository.create({
      ...createAuthDto,
      password: hashedPassword,
      otp: generatedOtp,
      isActive: false,
    });

    await this.userRepository.save(user);
    await this.emailService.sendOtp(user.email, generatedOtp);

    return {
      message: "Ro'yxatdan o'tish boshlandi. OTP kod yuborildi.",
      email: user.email,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: verifyOtpDto.email,
        otp: verifyOtpDto.otp,
      },
    });

    if (!user) {
      throw new BadRequestException(
        "Kod noto'g'ri yoki foydalanuvchi topilmadi",
      );
    }

    user.isActive = true;
    user.otp = null;

    await this.userRepository.save(user);

    return {
      message: 'Profil faollashtirildi',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!user.isActive) {
      throw new BadRequestException('Profil faollashtirilmagan');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Parol noto'g'ri");
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { token };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['articles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.findOne(id);

    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }

    await this.userRepository.update(id, updateAuthDto);

    return {
      message: 'Foydalanuvchi yangilandi',
    };
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return {
      message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    };
  }
}
