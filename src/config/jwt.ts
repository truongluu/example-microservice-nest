import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  admin_secret: process.env.ADMIN_SECRET_KEY,
  admin_secret_expires: process.env.ADMIN_SECRET_EXPIRES,
  user_secret: process.env.USER_SECRET_KEY,
  user_secret_expires: process.env.USER_SECRET_EXPIRES,
  partner_secret: process.env.PARTNER_SECRET_KEY,
  partner_secret_expires: process.env.PARTNER_SECRET_EXPIRES,
  internal_secret: process.env.INTERNAL_SECRET_KEY,
  internal_token: process.env.INTERNAL_TOKEN,
  internal_secret_expires: process.env.INTERNAL_SECRET_EXPIRES,
  user_otp_secret: process.env.USER_OTP_SECRET_KEY,
  user_otp_secret_expires: process.env.USER_OTP_SECRET_EXPIRES,
  partner_otp_secret: process.env.PARTNER_OTP_SECRET_KEY,
  partner_otp_secret_expires: process.env.PARTNER_OTP_SECRET_EXPIRES,

  partner_admin_secret: process.env.PARTNER_ADMIN_SECRET_KEY,
  partner_admin_secret_expires: process.env.PARTNER_ADMIN_SECRET_EXPIRES,
}));
