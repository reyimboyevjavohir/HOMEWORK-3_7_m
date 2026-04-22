import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Mening maqolam', description: 'Maqola sarlavhasi' })
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @ApiProperty({
    example: 'Bu yerda maqola matni...',
    description: 'Maqola matni',
  })
  @IsString()
  @IsNotEmpty()
  declare content: string;
}
