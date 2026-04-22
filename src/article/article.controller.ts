import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard, type AuthRequest } from '../auth/jwt.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi maqola yaratish' })
  @ApiResponse({ status: 201, description: 'Maqola yaratildi', type: Article })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan" })
  create(@Body() dto: CreateArticleDto, @Req() req: AuthRequest) {
    return this.articleService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha maqolalarni olish' })
  @ApiResponse({
    status: 200,
    description: "Maqolalar ro'yxati",
    type: [Article],
  })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta maqolani olish' })
  @ApiParam({ name: 'id', example: 1, description: 'Maqola ID si' })
  @ApiResponse({ status: 200, description: 'Maqola topildi', type: Article })
  @ApiResponse({ status: 404, description: 'Maqola topilmadi' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Maqolani yangilash' })
  @ApiParam({ name: 'id', example: 1, description: 'Maqola ID si' })
  @ApiResponse({ status: 200, description: 'Maqola yangilandi', type: Article })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan" })
  @ApiResponse({ status: 404, description: 'Maqola topilmadi' })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: AuthRequest,
  ) {
    return this.articleService.update(+id, updateArticleDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Maqolani o'chirish" })
  @ApiParam({ name: 'id', example: 1, description: 'Maqola ID si' })
  @ApiResponse({ status: 200, description: "Maqola o'chirildi" })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan" })
  @ApiResponse({ status: 404, description: 'Maqola topilmadi' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.articleService.remove(+id, req.user.id);
  }
}
