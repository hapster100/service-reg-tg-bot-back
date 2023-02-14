const { 
  addToCollection,
  getFromCollectionBetween, 
  getFromCollectionEq, 
  updateInCollection,
  getById,
  deleteFromCollection
} = require('./firebase')

function transformDate(order) {
  return {
    ...order,
    date: new Date(order.date.seconds * 1000)
  }
}

async function getDayOrders(year, month, day) {
  const from = new Date(Date.UTC(year, month, day))
  const to = new Date(Date.UTC(year, month, day + 1))

  const orders = await getFromCollectionBetween('orders', 'date', from, to)
  return orders.map(transformDate)
}

async function getMonthOrders(year, month) {
  const from = new Date(Date.UTC(year, month))
  const to = new Date(Date.UTC(year, month + 1))

  const orders = await getFromCollectionBetween('orders', 'date', from, to)
  return orders.map(transformDate)
}

async function getUserOrders(userId) {
  const orders = await getFromCollectionEq('orders', 'userId', userId)
  return orders.map(transformDate)
}

async function addOrder({ month, year, day, time, serviceIds, userId }) {
  return await addToCollection('orders', {
    date: new Date(Date.UTC(year, month, day)),
    time,
    serviceIds,
    userId,
  })
}

async function updateOrder(orderId, fields) {
  return await updateInCollection('orders', orderId, fields)
}

async function getOrderById(orderId) {
  return transformDate(await getById('orders', orderId))
}

async function deleteOrder(orderId) {
  return await deleteFromCollection('orders', orderId)
}

module.exports = {
  addOrder,
  updateOrder,
  deleteOrder,
  getDayOrders,
  getMonthOrders,
  getUserOrders,
  getOrderById,
}
