import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MailProvider } from './mail.provider.js';
import { MailQueue } from './mail.queue.js';
import { AppConfigService } from '../config';

@Injectable()
export class MailWorker implements OnModuleInit, OnModuleDestroy {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(
    private readonly config: AppConfigService,
    private readonly queue: MailQueue,
    private readonly provider: MailProvider,
  ) {}

  onModuleInit(): void {
    if (!this.config.mail.workerEnabled) return;

    this.timer = setInterval(() => {
      void this.process();
    }, this.config.mail.workerIntervalMs);
  }

  onModuleDestroy(): void {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;
  }

  async process(): Promise<void> {
    if (this.isProcessing || this.queue.size === 0) return;

    this.isProcessing = true;

    try {
      const jobs = this.queue.dequeueBatch(this.config.mail.workerBatchSize);

      for (const job of jobs) {
        await this.provider.send(job.message);
      }
    } finally {
      this.isProcessing = false;
    }
  }
}
