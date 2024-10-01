import { Injectable } from '@nestjs/common';

class EventEmitter {
  listeners: { [key: string]: Function[] } = {};

  emit(topic: string, message: string) {
    console.log(`Emitting message: ${message} on topic: ${topic}`);
    if (!this.listeners[topic]) {
      return;
    }
    this.listeners[topic].forEach((listener) => listener(message));
  }

  on(topic: string, listener: Function) {
    console.log(`Adding listener to topic: ${topic}`);
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }
    this.listeners[topic].push(listener);
  }
}

@Injectable()
export class MyClient extends EventEmitter {}
