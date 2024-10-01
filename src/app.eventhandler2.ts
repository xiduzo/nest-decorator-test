import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventHandler, EventPayload, Topic } from './Decorator';
import { MyClient } from './MyClient';

@Injectable()
@EventHandler(MyClient)
export class AppEventHandler2 {
  constructor(private readonly moduleRef: ModuleRef) {}

  @Topic('my_topic_2')
  handle(@EventPayload() payload: Record<string, unknown>) {
    console.log('Handling message 2', payload);
  }
}
