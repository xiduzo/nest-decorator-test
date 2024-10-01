import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyClient } from './MyClient';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const client = app.get(MyClient);

  client.emit(
    'message',
    JSON.stringify({
      message: 'sleep',
      topic: 'my_topic',
      data: 'some important data',
    }),
  );

  client.emit(
    'message',
    JSON.stringify({
      message: 'no_sleep',
      topic: 'my_topic',
      data: 'some other data',
    }),
  );
}
bootstrap();
