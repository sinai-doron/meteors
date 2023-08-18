import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DB } from './resources/meteors';
import { CacheModule } from './cache.module';

@Module({
  imports: [CacheModule],
  controllers: [AppController],
  providers: [{
    provide: 'MeteorDB',
    useValue: DB
  },AppService],
})
export class AppModule {}
