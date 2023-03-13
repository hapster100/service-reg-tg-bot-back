const { getMasterById } = require("../storage/masters")
const { getNotifysBefore, deleteNotify } = require("../storage/notifies")
const { getOrderById } = require("../storage/orders")
const { tgApi } = require("./api/base")

async function notify() {
  
  const notifies = await getNotifysBefore(new Date())
  const masters = {}

  console.log('notify', new Date().toString())

  for(const notify of notifies) {
    try {
      const {
        text,
        orderId,
      } = notify
      const order = await getOrderById(orderId)
      const {
        masterId,
        userId,
      } = order
      
      if (!masters[masterId]) {
        masters[masterId] = await getMasterById(masterId)
      }
  
      await tgApi(masters[masterId].telegramToken)
        .sendMessage(userId, text)
  
    } catch(e) {
      console.error('\nNOTIFY ERROR:')
      console.error('notify:', notify)
      console.error(e)
    } finally {
      await deleteNotify(notify.id)    
    }
  }
  setTimeout(notify, 1000 * 60)
}

module.exports = {
  notify
}
