import { Global, Module } from '@nestjs/common';
import { MailPort } from '../../shared/domain/ports';
import { AppConfigModule } from '../config';
import { AppConfigService } from '../config';
import { MailProvider } from './mail.provider.js';
import { MailQueue } from './mail.queue.js';
import { MailService } from './mail.service.js';
import { MailWorker } from './mail.worker.js';
import { NoopMailProvider } from './providers/noop-mail.provider.js';
import { SmtpMailProvider } from './providers/smtp-mail.provider.js';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    MailQueue,
    MailWorker,
    MailService,
    NoopMailProvider,
    SmtpMailProvider,
    {
      provide: MailProvider,
      inject: [AppConfigService, SmtpMailProvider, NoopMailProvider],
      useFactory: (
        config: AppConfigService,
        smtpProvider: SmtpMailProvider,
        noopProvider: NoopMailProvider,
      ) => {
        return config.mail.provider === 'smtp' ? smtpProvider : noopProvider;
      },
    },
    { provide: MailPort, useExisting: MailService },
  ],
  exports: [MailService, MailPort],
})
export class MailModule {}
