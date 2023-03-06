const express = require('express')
const { getMasterById } = require('../storage/masters')
const { getMasterId } = require('../utils')

mastersRouter = express.Router()

mastersRouter.get('/address', async (req, res) => {
  const masterId = getMasterId(req)
  try {
    const master = await getMasterById(masterId)
    res.send({ address: master.address })
  } catch (e) {
    res.send({ address: '' })
  }
})

module.exports = {
  mastersRouter
}
