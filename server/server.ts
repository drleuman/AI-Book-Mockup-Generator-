
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

app.listen(config.port, () => {
  logger.info('Mockup BFF listening', {
    port: config.port,
    env: config.nodeEnv,
  });
});
