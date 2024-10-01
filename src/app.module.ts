import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppEventHandler } from './app.eventhandler';
import { AppService } from './app.service';
import { MyClient } from './MyClient';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppEventHandler, MyClient],
})
export class AppModule {}
