const { tgApiFetch } = require('./base')

async function getMe() {
  return await tgApiFetch('getMe')
}

module.exports = {
  getMe,
}
