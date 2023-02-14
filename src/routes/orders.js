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
const { getSlots } = require('../utils')

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
  const serviceDuration = services.reduce((acc, s) => (acc[s.id] = s.durationMinutes, acc), {})

  const daysInMonth = new Date(Date.UTC(year, month+1, 0)).getDate()

  const ordersByDay = {}
  
  for(let i = 0; i < daysInMonth; i++) {
    ordersByDay[i+1] = []
  }
  for(const order of orders) {
    const day = order.date.getDate()
    ordersByDay[day].push(order)
  }

  const slotsByDay = {}
  const currDate = new Date()
  
  const currYear = currDate.getFullYear()
  const currMonth = currDate.getMonth()
  const currDay = currDate.getDate()

  for(let i = 0; i < daysInMonth; i++) {
    const day = i + 1

    slotsByDay[day] = []
    
    if (year < currYear) continue
    if (year === currYear && month < currMonth) continue
    if (year === currYear && month === currMonth && day < currDay) continue
    if (shedulle[day].free) continue
    
    const free = shedulle[day].intervals.map(({from, to}) => [from, to]) 
    const taken = []
    
    for (const order of ordersByDay[day]) {
      const start = order.time.hours * 60 + order.time.minutes
      const duration = order.serviceIds.reduce((acc, id) => acc + serviceDuration[id], 0)
      taken.push([start, start + duration])
    }

    slotsByDay[day] = getSlots(free, taken, duration)
    
  }

  res.send(JSON.stringify(slotsByDay))
})

module.exports = {
  ordersRouter
}
