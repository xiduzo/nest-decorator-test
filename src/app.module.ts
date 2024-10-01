import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppEventHandler } from './app.eventhandler';
import { AppEventHandler2 } from './app.eventhandler2';
import { AppService } from './app.service';
import { MyClient } from './MyClient';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppEventHandler, AppEventHandler2, MyClient],
})
export class AppModule {}
