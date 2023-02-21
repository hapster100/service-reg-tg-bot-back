const express = require('express')
const { DAYS } = require('../config')
const { 
  addOrder,
  deleteOrder,
  getDayOrders,
  getMonthOrders,
  getUserOrders,
  getOrderById,
} = require('../storage/orders')
const { getServices } = require('../storage/services')
const { getMonthShedulle } = require('../storage/shedulle')
const { shedulleSlots } = require('../utils')

ordersRouter = express.Router()

ordersRouter.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const orders = await getUserOrders(id)
  res.send(JSON.stringify({ orders }))
})

ordersRouter.post('/get', async (req, res) => {
  const { year, month, day } = req.body
  let orders;
  if (!day) {
    orders = await getMonthOrders(year, month)
  } else {
    orders = await getDayOrders(year, month, day)
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
    await deleteOrder(id)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

ordersRouter.post('/', async (req, res) => {
  const { order } = req.body
  try {
    await addOrder(order)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

ordersRouter.post('/slots', async (req, res) => {
  const { year, month, duration } = req.body
  
  const orders = await getMonthOrders(year, month)
  const shedulle = await getMonthShedulle(year, month)
  const services = await getServices()

  res.send(JSON.stringify(shedulleSlots(services, orders, shedulle, duration)))
})

module.exports = {
  ordersRouter
}
