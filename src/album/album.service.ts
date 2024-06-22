import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Album } from './album.entity';
import { Media } from 'src/media/media.entity';
import { AlbumDTO, CreateAlbumDto } from './dto/album.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class AlbumService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Media)
    private imageRepository: Repository<Media>,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { title, media } = createAlbumDto;
    if (!user) {
      throw new Error('사용자 정보가 없습니다.');
    }

    try {
      const newAlbum = new Album();
      newAlbum.title = title;
      newAlbum.user = user;
      const savedAlbum = await this.albumRepository.save(newAlbum);

      const newMedia = new Media();
      newMedia.album = savedAlbum;
      newMedia.uri = media.mediaUri;
      newMedia.mediaType = media.mediaType;

      const savedMedia = await this.imageRepository.save(newMedia);
      savedAlbum.media = [savedMedia];

      await this.albumRepository.save(savedAlbum);
      console.log(savedAlbum);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAlbums(user: User) {
    const albums = await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.media', 'media')
      .where('album.user = :user', { user: user.id })
      .getMany();

    return albums.map((album) => {
      const albumDto = new AlbumDTO();
      albumDto.id = album.id;
      albumDto.title = album.title;
      albumDto.media = {
        mediaUri: album.media[0].uri,
        mediaType: album.media[0].mediaType,
      };
      return albumDto;
    });
  }
}
