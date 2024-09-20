import appConfig from './app';
import authConfig from './auth';
import bullConfig from './bull';
import databaseConfig from './database';
import endpointConfig from './endpoint';
import jwtConfig from './jwt';
import redisConfig from './redis';
import smtpConfig from './smtp';

export const allConfigs = [
  appConfig,
  authConfig,
  bullConfig,
  databaseConfig,
  endpointConfig,
  jwtConfig,
  redisConfig,
  smtpConfig,
];
