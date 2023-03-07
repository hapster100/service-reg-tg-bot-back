const { getMasterById } = require("../storage/masters")
const { deleteOrderNotifys } = require("../storage/notifies")
const { getUser } = require('../storage/users')
const { timeStr, dateStr, formatServices } = require("../utils")
const { tgApi } = require("./api/base")

async function deleteOrderNotify(order) {
  const {
    masterId,
    time: {
      hours: h,
      minutes: m,
    },
    date,
    userId,
    serviceIds,
  } = order

  const master = await getMasterById(masterId)
  const client = await getUser(userId)
  
  const dateTimeStr = [timeStr(h, m), dateStr(date)].join(', ')

  const serviceNames = await formatServices(masterId, serviceIds)

  await tgApi(master.telegramToken).sendMessage(
    master.userId,
    `Запись отменена: ${dateTimeStr}\n` + serviceNames.join('\n') +
    `\nИмя: ${client?.name || '---'}\nНомер: ${client?.phone || '---'}`
  )

  await tgApi(master.telegramToken).sendMessage(
    userId,
    `Запись отменена: ${dateTimeStr}\n` + serviceNames.join('\n')
  )

  await deleteOrderNotifys(order.id)
}

module.exports = {
  deleteOrderNotify
}
