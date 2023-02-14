const { getMe } = require('./getMe')
const { getUpdates } = require('./getUpdates')
const { sendMessage } = require('./sendMessage')
const { editMessageCaption, editMessageText } = require('./editMessage')
const { setMyCommands } = require('./setMyCommands')

module.exports = {
  getMe,
  getUpdates,
  sendMessage,
  editMessageCaption,
  editMessageText,
  setMyCommands,
}
