import { registerAs } from '@nestjs/config';

export default registerAs('endpoint', () => ({
  auth_api: process.env.AUTH_API,
  general_api: process.env.GENERAL_API,
}));
