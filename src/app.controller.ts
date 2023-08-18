import { Controller, Get, HttpException, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import Meteor from './interfaces/Meteor';
import { CacheInterceptor } from './cache.interceptor';
import PagedResponse from './interfaces/PagedResponse';

@Controller('meteors')
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAllMeteors(@Query('page') page:string): PagedResponse {
    return this.appService.getAllMeteors(page);
  }

  @Get('/year/:year')
  GetMeteorsByYear(@Param('year') year:string, @Query('mass') mass:string):PagedResponse{
    if(isNaN(parseInt(year)) && year.toLowerCase() !== 'unknown'){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Usage: year should be a valid year or unknown',
      }, HttpStatus.BAD_REQUEST, {
        cause: ''
      });
    }
    return this.appService.getMeteorsByYear(year, mass);
  }

  @Get('/years')
  GetAllYears():Array<number> {
      return this.appService.GetAllYears();
  }
}
