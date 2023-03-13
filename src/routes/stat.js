const express = require('express')
const { getStatisticOrders } = require('../storage/orders')
const { getMasterId } = require('../utils')

const statisticRouter = express.Router()

statisticRouter.post('/orders', async (req, res) => {
  const masterId = getMasterId(req)
  const { period } = req.body
  try {
    const orders = await getStatisticOrders(masterId, period)
    res.send({ orders })
  } catch (e) {
    res.send({ orders: [] })
  }
})

module.exports = {
  statisticRouter
}
