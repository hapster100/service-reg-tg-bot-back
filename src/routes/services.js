const express = require('express')
const { getServices, getService, addService, deleteService } = require('../storage/services')
const { getMasterId } = require('../utils')

servicesRouter = express.Router()

servicesRouter.get('/', async (req, res) => {
  const masterId = getMasterId(req)
  const services = await getServices(masterId)
  res.send(JSON.stringify({ services }))
})

servicesRouter.post('/', async (req, res) => {
  const { service } = req.body
  const masterId = getMasterId(req)
  try {
    await addService({...service, masterId})
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

servicesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await deleteService(id)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  servicesRouter
}
