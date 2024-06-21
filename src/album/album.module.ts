import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Album } from './album.entity';
import { Media } from 'src/media/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Media]), AuthModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
