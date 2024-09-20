import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => ({
  user: process.env.BULL_USER,
  password: process.env.BULL_PASSWORD,
}));
