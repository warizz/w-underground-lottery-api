const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  try {
    const config = require('../config.json');
    const envConfig = config[env];
    Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
  } catch (e) {
    // console.error(e);
  }
}
