import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.HOST,
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  internal_token: process.env.INTERNAL_TOKEN,
  pageSize: process.env.PAGE_SIZE || 10,
}));
