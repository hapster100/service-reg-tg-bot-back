const { getMasterById } = require("../storage/masters")
const { getUser } = require("../storage/users")
const { timeStr, dateStr, formatServices } = require("../utils")
const { tgApi } = require("./api/base")

async function newOrderNotify(order) {
  const {
    masterId,
    time: {
      hours: h,
      minutes: m,
    },
    year,
    month,
    day,
    userId,
    serviceIds,
  } = order

  const date = new Date(year, month, day)
  const master = await getMasterById(masterId)
  const client = await getUser(userId)

  const dateTimeStr = [timeStr(h, m), dateStr(date)].join(', ')

  const serviceNames = await formatServices(masterId, serviceIds)
  
  await tgApi(master.telegramToken).sendMessage(
    master.userId,
    `Новая запись: ${dateTimeStr}\n` + serviceNames.join('\n') +
    `\nИмя: ${client?.name || '---'}\nНомер: ${client?.phone || '---'}`
  )

  await tgApi(master.telegramToken).sendMessage(
    userId,
    `Вы записаны: ${dateTimeStr}\n` + serviceNames.join('\n')
  )
}

module.exports = {
  newOrderNotify
}
