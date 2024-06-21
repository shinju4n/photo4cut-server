import { IsString, MaxLength, MinLength } from 'class-validator';
import { Media } from 'src/media/media.entity';

export class CreateAlbumDto {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  title: string;

  media: {
    mediaUri: string;
    mediaType: Media['mediaType'];
  };
}
