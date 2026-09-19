import { Injectable } from '@nestjs/common';
import { MailProvider } from './mail.provider.js';
import { MailQueue } from './mail.queue.js';
import { MailMessage } from './mail.types.js';
import { MailPort } from '../../shared/domain/ports';

@Injectable()
export class MailService extends MailPort {
  constructor(
    private readonly queue: MailQueue,
    private readonly provider: MailProvider,
  ) {
    super();
  }

  send(message: MailMessage): Promise<void> {
    this.queue.enqueue(message);
    return Promise.resolve();
  }

  async flush(): Promise<void> {
    while (this.queue.size > 0) {
      const jobs = this.queue.dequeueBatch(this.queue.size);

      for (const job of jobs) {
        await this.provider.send(job.message);
      }
    }
  }
}
