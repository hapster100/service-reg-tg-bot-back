
const { existsInCollection, getById, setToCollection, updateInCollection } = require('./mongoose')

const monthId = (year, month, masterId) => [year, month, masterId].join('.')

async function getMonthShedulle(year, month, masterId) {
  const id = monthId(year, month, masterId)
  const exists = await existsInCollection('shedulle', id)
  if (!exists) {
    await createMonthShedulle(year, month, masterId)
  }
  const days = await getById('shedulle', id)
  return days
}

async function createMonthShedulle(year, month, masterId) {
  console.log('create shedulle', year, month, masterId)
  const daysInMonth = new Date(Date.UTC(year, month+1, 0)).getDate()
  const days = {}
  for(let i = 1; i <= daysInMonth; i++) {
    days[i] = {
      free: true,
      intervals: [],
    }
  }

  return await setToCollection('shedulle', monthId(year, month, masterId), days)
}

async function updateMonthShedulle(year, month, masterId, update) {
  return await updateInCollection('shedulle', monthId(year, month, masterId), update)
}

module.exports = {
  getMonthShedulle,
  updateMonthShedulle,
}
