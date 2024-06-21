import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { Album } from 'src/album/album.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Album, User])],
  controllers: [MediaController],
})
export class MediaModule {}
