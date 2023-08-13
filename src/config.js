const isDev = !!process.env.DEV;

module.exports = {
  STEP: 15,
  SERVER_PORT: isDev ? 3000 : 443,
  USE_HTTPS: !isDev,
  DEV_MODE: isDev,
  MONGODB_CONNECT_STR: isDev ? 'mongodb://127.0.0.1:27017/test' : 'mongodb://prod',
  HOST: isDev ? 'http://localhost:3000' : 'https://barberbot96.ru'
}
