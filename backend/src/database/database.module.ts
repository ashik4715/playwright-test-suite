import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Blog],
      synchronize: true, // For development only
    }),
    TypeOrmModule.forFeature([User, Blog]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

