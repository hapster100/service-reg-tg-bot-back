module.exports = {
  DAYS: {
    STEP: 15,
    WEEK: [true, true, true, true, true, false, false],
    INTERVALS: [[8 * 60, 15 * 60], [16 * 60, 20 * 60]]
  },
  SERVER: {
    PORT: 443,
    HTTPS: true,
  },
  DEV_MODE: false,
  MONGODB_CONNECT_STR: 'mongodb://127.0.0.1:27017/test',
  HOST: 'https://aland97.ru'
}