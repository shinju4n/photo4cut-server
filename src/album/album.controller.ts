import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAlbumDto } from './dto/album.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('album')
@UseGuards(AuthGuard())
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post('/create')
  createPost(@Body() createAlbumDto: CreateAlbumDto, @GetUser() user: User) {
    return this.albumService.createAlbum(createAlbumDto, user);
  }

  @Get('/')
  getAlbums(@GetUser() user: User) {
    return this.albumService.getAlbums(user);
  }
}
