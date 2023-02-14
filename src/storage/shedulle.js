
const { DAYS } = require('../config')
const { existsInCollection, getById, setToCollection, updateInCollection } = require('./firebase')

const monthId = (year, month) => [year, month].join('.')

async function getMonthShedulle(year, month) {
  const id = monthId(year, month)
  const exists = await existsInCollection('shedulle', id)
  if (!exists) {
    await createMonthShedulle(year, month)
  }
  const days = await getById('shedulle', id)
  return days
}

async function createMonthShedulle(year, month) {
  console.log('create shedulle', year, month)
  const daysInMonth = new Date(Date.UTC(year, month+1, 0)).getDate()
  const days = {}
  for(let i = 1; i <= daysInMonth; i++) {
    days[i] = {
      free: false,
      intervals: DAYS.INTERVALS.map(([from, to]) => ({from, to})),
    }
  }

  return await setToCollection('shedulle', monthId(year, month), days)
}

async function updateMonthShedulle(year, month, update) {
  return await updateInCollection('shedulle', monthId(year, month), update)
}

module.exports = {
  getMonthShedulle,
  updateMonthShedulle,
}
