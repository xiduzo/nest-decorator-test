import { ModuleRef } from '@nestjs/core';
import { MyClient } from './MyClient';

const topicMetadataKey = Symbol('MqttTopicMetadata');
const payloadMetadataKey = Symbol('PayloadMetadata');

type Listener = {
  topicName: string;
  method: string;
};

export function Topic(topicName: string) {
  return (target: NonNullable<unknown>, propertyKey: string) => {
    Reflect.defineMetadata(
      topicMetadataKey,
      { method: propertyKey, topicName } satisfies Listener,
      target,
    );
  };
}

export function EventPayload() {
  return (
    target: NonNullable<unknown>,
    _propertyKey: string,
    parameterIndex: number,
  ) => {
    Reflect.defineMetadata(payloadMetadataKey, parameterIndex, target);
  };
}

export function EventHandler<
  MyEventEmitterClientClient extends new (...args: unknown[]) => MyClient,
>(MyClient: MyEventEmitterClientClient) {
  return function <T extends { new (...args: any[]): object }>(Base: T) {
    class DecoratedClass extends Base {
      readonly listener = Reflect.getMetadata(
        topicMetadataKey,
        this,
      ) as Listener;
      readonly payloadIndex = Reflect.getMetadata(payloadMetadataKey, this) as
        | number
        | undefined;

      client: MyClient;
      parsedPayload: Record<string, unknown> | undefined = undefined;

      constructor(...args: any[]) {
        super(...args);

        // Super hacky way to get the ModuleRef & MyClient from the arguments
        const moduleRef = args.find(
          (arg) =>
            arg instanceof ModuleRef ||
            ('container' in arg && 'injector' in arg),
        ) as ModuleRef | undefined;

        if (!moduleRef) {
          throw new Error(
            '@EventHandler decorator needs a ModuleRef as an argument to the constructor of the decorated class',
          );
        }

        this.client = moduleRef.get(MyClient, { strict: false });
        if (!this.client) {
          throw new Error(
            'MyClient not found, make sure it is provided in the module',
          );
        }

        this.client.on('message', async (payload: string) => {
          this.parsedPayload = JSON.parse(payload);

          if (this.parsedPayload.topic !== this.listener.topicName) {
            return; // We are not insterested in processing this message
          }

          if (this.parsedPayload.message === 'sleep') {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          this[this.listener.method](this.parsedPayload);
        });
      }
    }

    return DecoratedClass;
  };
}
