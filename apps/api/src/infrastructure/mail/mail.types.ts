export type MailMessage = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};
