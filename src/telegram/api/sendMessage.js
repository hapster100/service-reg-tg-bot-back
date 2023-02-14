const { tgApiFetch } = require('./base')

async function sendMessage({
  chatId,
  text,
  replyMarkup,
}) {
  return await tgApiFetch('sendMessage', 'POST', {
    'chat_id': chatId,
    text,
    reply_markup: replyMarkup,
  }) 
}

module.exports = {
  sendMessage,
}
