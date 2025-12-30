import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../database/entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, userId: number): Promise<Blog> {
    const blog = this.blogRepository.create({
      ...createBlogDto,
      authorId: userId,
    });
    return this.blogRepository.save(blog);
  }

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    userId: number,
  ): Promise<Blog> {
    const blog = await this.findOne(id);
    if (blog.authorId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }
    Object.assign(blog, updateBlogDto);
    return this.blogRepository.save(blog);
  }

  async remove(id: number, userId: number): Promise<void> {
    const blog = await this.findOne(id);
    if (blog.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }
    await this.blogRepository.remove(blog);
  }
}

