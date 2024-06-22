import { IsString, MaxLength, MinLength } from 'class-validator';
import { Media } from 'src/media/media.entity';

class MediaInfo {
  mediaUri: string;
  mediaType: Media['mediaType'];
}

export class CreateAlbumDto {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  title: string;

  media: MediaInfo;
}

export class AlbumDTO {
  id: number;
  title: string;
  media: MediaInfo;
}
