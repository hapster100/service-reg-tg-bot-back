const { tgApiFetch } = require('./base')

async function editMessageCaption({
  chatId,
  messageId,
  inlineMessageId,
  caption,
  replyMarkup
}) {
  const res = await tgApiFetch('editMessageCaption', 'POST', {
    chat_id: chatId,
    message_id: messageId,
    inline_message_id: inlineMessageId,
    caption,
    reply_markup: replyMarkup
  })
  return res
}

async function editMessageText({
  chatId,
  messageId,
  inlineMessageId,
  text,
  parseMode,
  disableWebPagePreview,
  replyMarkup,
}) {
  const res = await tgApiFetch('editMessageText', 'POST', {
    chat_id: chatId,
    message_id: messageId,
    inline_message_id: inlineMessageId,
    text,
    parse_mode: parseMode,
    disabel_web_page_preview: disableWebPagePreview,
    reply_markup: replyMarkup,
  })
  return res
}

module.exports = {
  editMessageCaption,
  editMessageText,
}
