const express = require('express')
const { 
  addOrder,
  deleteOrder,
  getDayOrders,
  getMonthOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
} = require('../storage/orders')
const { getServices } = require('../storage/services')
const { getMonthShedulle } = require('../storage/shedulle')
const { shedulleSlots, getMasterId } = require('../utils')

const { newOrderNotify } = require('../telegram/newOrderNotify')
const { deleteOrderNotify } = require('../telegram/deleteOrderNotify')

ordersRouter = express.Router()

ordersRouter.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const masterId = getMasterId(req)

  const orders = await getUserOrders(id, masterId)
  res.send(JSON.stringify({ orders }))
})

ordersRouter.post('/get', async (req, res) => {
  const { year, month, day } = req.body
  const masterId = getMasterId(req)

  let orders;
  if (!day) {
    orders = await getMonthOrders(year, month, masterId)
  } else {
    orders = await getDayOrders(year, month, day, masterId)
  }

  res.send(JSON.stringify({ orders }))
})

ordersRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const order = await getOrderById(id)
  res.send(JSON.stringify({ order }))
})

ordersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const order = await getOrderById(id)
    await deleteOrder(id)
    res.send({ success: true })

    deleteOrderNotify(order)

  } catch (e) {
    res.send({ success: false })
  }
})

ordersRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { order } = req.body

  if (order.id === id) {
    delete order.id
    try {
      await updateOrder(id, {...order, date: new Date(order.date)})
      res.send({ success: true })
    } catch (e) {
      res.send({ success: false })
    }
  } else {
    res.send({ success: false })
  }
})

ordersRouter.post('/', async (req, res) => {
  const { order } = req.body
  const masterId = getMasterId(req)

  const orderWithMaster = { ...order, masterId }

  try {
    await addOrder(orderWithMaster)
    res.send({ success: true })

    newOrderNotify(orderWithMaster)
  
  } catch (e) {
    res.send({ success: false })
  }
})

ordersRouter.post('/slots', async (req, res) => {
  const { year, month, duration, orderId = '' } = req.body
  const masterId = getMasterId(req)
  
  const orders = (await getMonthOrders(year, month, masterId))
    .filter(ord => ord.id !== orderId)
  const shedulle = await getMonthShedulle(year, month, masterId)
  const services = await getServices(masterId)


  res.send(JSON.stringify(shedulleSlots(
    year, month, services,
    orders, shedulle, duration
  )))
})

module.exports = {
  ordersRouter
}
