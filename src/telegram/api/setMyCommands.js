const { tgApiFetch } = require('./base')

async function setMyCommands(commands) {
  return await tgApiFetch('setMyCommands', 'POST', { commands })
}

module.exports = {
  setMyCommands
}
