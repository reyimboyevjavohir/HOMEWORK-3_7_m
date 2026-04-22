import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID si' })
  @PrimaryGeneratedColumn()
  declare id: number;

  @ApiProperty({ example: 'user@gmail.com', description: 'Email manzil' })
  @Column({ unique: true })
  declare email: string;

  @ApiProperty({ example: 'Secret123!', description: 'Parol' })
  @Column()
  declare password: string;

  @ApiProperty({
    example: 'ali_karimov',
    description: 'Foydalanuvchi nomi',
    nullable: true,
  })
  @Column({ nullable: true })
  declare username: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP tasdiqlash kodi',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true, default: null })
  declare otp: string | null;

  @ApiProperty({ example: false, description: 'Akkaunt faolligi' })
  @Column({ default: false })
  declare isActive: boolean;

  @ApiProperty({
    description: 'Foydalanuvchi maqolalari',
    type: () => [Article],
  })
  @OneToMany(() => Article, (article) => article.user)
  declare articles: Article[];
}
