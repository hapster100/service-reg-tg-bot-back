const express = require('express')
const { getMasterById } = require('../storage/masters')
const { getUser, updateUser, getUsers } = require('../storage/users')
const { getMasterOrders } = require('../storage/orders')
const { getMasterId } = require('../utils')
const { DEV_MODE } = require('../config')

const usersRouter = express.Router()


usersRouter.get('/clients', async (req, res) => {
  try {
    const masterId = getMasterId(req)
    const orders =  await getMasterOrders(masterId)
    const userIds = [...new Set(orders.map(order => order.userId))]
    
    const lastOrder = {}
    const ordersCount = {}

    for(const {userId, date, deleted} of orders) {
      if (!lastOrder[userId] || date > lastOrder[userId]) {
        lastOrder[userId] = date
      }
      if (!deleted) {
        ordersCount[userId] = (ordersCount[userId] || 0) + 1
      }
    }
    const users = await getUsers(userIds)
    const clientListUsers = users.map(user => ({
      ...user,
      lastOrder: lastOrder[user.id],
      ordersCount: ordersCount[user.id]
    }))
    res.send({ users: clientListUsers })

  } catch (e) {
    res.send({ users: null })
  }

})

usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const masterId = getMasterId(req)

    const user = await getUser(id) || null
    const master = await getMasterById(masterId)
    const isAdmin = master?.userId === id || DEV_MODE

    res.send({ user: { ...user, isAdmin } })
  } catch (e) {
    res.send({ user: null })
  }
})

usersRouter.post('/byIds', async (req, res) => {
  try {
    const { ids } = req.body
    const users = await getUsers(ids)
    res.send({ users })
  } catch (e) {
    res.send({ users: null })
  }
})

usersRouter.post('/', async (req, res) => {
  const { user } = req.body
  try {
    await updateUser(user)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})


module.exports = {
  usersRouter,
}
