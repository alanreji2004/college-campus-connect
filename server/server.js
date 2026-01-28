const app = require('./src/app');
const config = require('./src/config');
const { logger } = require('./src/utils/logger');

app.listen(config.port, () => {
  logger.info(`Campus Connect server listening on port ${config.port}`);
});

