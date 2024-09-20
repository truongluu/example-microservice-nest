import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  schemas: ['account', 'user', 'internal'],
}));
