import { registerAs } from '@nestjs/config';

export default registerAs('smtp', () => ({
  smtp_host: process.env.EMAIL_SMTP_HOST,
  sender_default: process.env.EMAIL_SENDER_DEFAULT,
  domain_link: process.env.DOMAIN_LINK,
}));
