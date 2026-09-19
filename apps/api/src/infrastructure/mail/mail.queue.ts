import { Injectable } from '@nestjs/common';
import { MailMessage } from './mail.types.js';

type QueuedMail = {
  message: MailMessage;
  createdAt: number;
};

@Injectable()
export class MailQueue {
  private readonly queue: QueuedMail[] = [];

  enqueue(message: MailMessage): void {
    this.queue.push({
      message,
      createdAt: Date.now(),
    });
  }

  dequeueBatch(size: number): QueuedMail[] {
    return this.queue.splice(0, size);
  }

  get size(): number {
    return this.queue.length;
  }
}
