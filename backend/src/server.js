const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Campus Connect backend listening on port ${config.port}`);
});

