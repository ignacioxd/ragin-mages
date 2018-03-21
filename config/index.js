if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod.config.js');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test.config.js');
} else {
  module.exports = require('./dev.config.js');
}
