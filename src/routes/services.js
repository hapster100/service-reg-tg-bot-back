const express = require('express')
const { getServices, getService, addService } = require('../storage/services')

servicesRouter = express.Router()

servicesRouter.get('/', async (_, res) => {
  const services = await getServices()
  res.send(JSON.stringify({ services }))
})

servicesRouter.post('/', async (req, res) => {
  const { service } = req.body
  try {
    await addService(service)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

servicesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const service = await getService(id)
  res.send(JSON.stringify({ service }))
})


module.exports = {
  servicesRouter
}
