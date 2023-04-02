module.exports = {
  STEP: 15,
  SERVER_PORT: 443,
  USE_HTTPS: true,
  DEV_MODE: !!process.env.DEV,
  MONGODB_CONNECT_STR: process.env.DEV ? 'mongodb://127.0.0.1:27017/test' : 'mongodb://bot:ds1ms9dfsmaze9crop7@127.0.0.1:27017/shedullebot',
  HOST: process.env.DEV ? 'https://aland97.ru' : 'https://barberbot96.ru'
}
