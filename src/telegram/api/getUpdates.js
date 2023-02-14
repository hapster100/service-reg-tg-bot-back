const { tgApiFetch } = require('./base')
const { TgUpdate } = require('./types')

async function getUpdates(offset = 0, limit = 100, timeout = 0) {
  const res =  await tgApiFetch('getUpdates', 'POST', {
    offset,
    limit,
    timeout
  })

  return TgUpdate.fromArray(res.result)
}

module.exports = {
  getUpdates,
}
