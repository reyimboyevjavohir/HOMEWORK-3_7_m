import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity('articles')
export class Article {
  @ApiProperty({ example: 1, description: 'Maqola ID si' })
  @PrimaryGeneratedColumn()
  declare id: number;

  @ApiProperty({ example: 'Mening maqolam', description: 'Maqola sarlavhasi' })
  @Column()
  declare title: string;

  @ApiProperty({
    example: 'Bu yerda maqola matni...',
    description: 'Maqola matni',
  })
  @Column()
  declare content: string;

  @ApiProperty({ description: 'Maqola muallifi', type: () => User })
  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  declare user: User;
}
