const SECRETS = require('./secrets.json');

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  IOPORT: process.env.IOPORT || 3030,
};
