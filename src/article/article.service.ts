import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/auth.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const article = this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      user,
    });

    await this.articleRepository.save(article);

    return { message: 'Maqola yaratildi', article };
  }

  async findAll() {
    return this.articleRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('Maqola topilmadi');
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const article = await this.findOne(id);

    if (article.user.id !== userId) {
      throw new ForbiddenException("Siz bu maqolani o'zgartira olmaysiz");
    }

    await this.articleRepository.update(id, {
      title: updateArticleDto.title,
      content: updateArticleDto.content,
    });

    return { message: 'Maqola yangilandi' };
  }

  async remove(id: number, userId: number) {
    const article = await this.findOne(id);

    if (article.user.id !== userId) {
      throw new ForbiddenException("Siz bu maqolani o'chira olmaysiz");
    }

    await this.articleRepository.remove(article);

    return { message: "Maqola o'chirildi" };
  }
}
