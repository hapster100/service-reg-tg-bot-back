const { 
  addToCollection,
  updateInCollection,
  getById,
  getFromCollectionWhere
} = require('./mongoose')

function transformDate(order) {
  if (!order instanceof Date) {
    return {
      ...order,
      date: new Date(order.date.seconds * 1000)
    }
  }
  return order
}

function filterDeleted(order) {
  return !order.deleted
}

async function getDayOrders(year, month, day, masterId) {
  const from = new Date(Date.UTC(year, month, day))
  const to = new Date(Date.UTC(year, month, day + 1))
  const orders = await getFromCollectionWhere('orders',
    ['date', '>=', from],
    ['date', '<', to],
    ['masterId', '==', masterId]
  )
  return orders.map(transformDate).filter(filterDeleted)
}

async function getMonthOrders(year, month, masterId) {
  const from = new Date(Date.UTC(year, month))
  const to = new Date(Date.UTC(year, month + 1))
  const orders = await getFromCollectionWhere('orders',
    ['date', '>=', from],
    ['date', '<', to],
    ['masterId', '==', masterId],
  )
  return orders.map(transformDate).filter(filterDeleted)
}

async function getUserOrders(userId, masterId) {
  const orders = await getFromCollectionWhere('orders',
    ['userId', '==', userId],
    ['masterId', '==', masterId],
  )
  return orders.map(transformDate).filter(filterDeleted)
}

async function getStatisticOrders(masterId, period) {
  const { from, to } = period
  const orders = await getFromCollectionWhere('orders',
    ['masterId', '==', masterId],
    ['date', '>=', from],
    ['date', '<=', to]
  )
  return orders.map(transformDate)
}

async function addOrder({ month, year, day, time, serviceIds, userId, masterId }) {
  return await addToCollection('orders', {
    date: new Date(Date.UTC(year, month, day)),
    time,
    serviceIds,
    userId: String(userId),
    masterId
  })
}

async function updateOrder(orderId, fields) {
  return await updateInCollection('orders', orderId, fields)
}

async function getOrderById(orderId) {
  return transformDate(await getById('orders', orderId))
}

async function deleteOrder(orderId) {
  return updateOrder(orderId, { deleted: true })
}

module.exports = {
  addOrder,
  updateOrder,
  deleteOrder,
  getDayOrders,
  getMonthOrders,
  getUserOrders,
  getOrderById,
  getStatisticOrders,
}
