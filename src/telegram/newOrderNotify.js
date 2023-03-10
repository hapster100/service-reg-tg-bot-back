const { getMasterById } = require("../storage/masters")
const { addNotify } = require("../storage/notifies")
const { getUser } = require("../storage/users")
const { timeStr, dateStr, formatServices, phoneStr } = require("../utils")
const { tgApi } = require("./api/base")

async function newOrderNotify(order) {
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

  const clientStr = `\nИмя: ${client?.name || '---'}\nНомер: ${phoneStr(client?.phone || '')}` 

  await tgApi(master.telegramToken).sendMessage(
    master.userId,
    `Новая запись: ${dateTimeStr}\n` +
    serviceNames.join('\n') +
    clientStr
  )

  await tgApi(master.telegramToken).sendMessage(
    userId,
    `Вы записаны: ${dateTimeStr}\n` + serviceNames.join('\n')
  )
  
  const now = new Date()
  const byDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, h, m)
  const byTwoHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h - 2, m)
  
  if (now < byDay) {
    await addNotify(
      order.id,
      `Напоминаем, вы записаны:\n${dateTimeStr}\n` + serviceNames.join('\n'),
      byDay
    )
  }

  if (now < byTwoHour) {
    await addNotify(
      order.id,
      `Напоминаем, вы записаны:\n${dateTimeStr}\n` + serviceNames.join('\n'),
      byTwoHour,
    )
  }
}

module.exports = {
  newOrderNotify
}
