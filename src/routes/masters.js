const express = require('express')
const { getMasterById, updateMaster } = require('../storage/masters')
const { getMasterId } = require('../utils')

mastersRouter = express.Router()

mastersRouter.get('/info', async (req, res) => {
  const masterId = getMasterId(req)
  try {
    const master = await getMasterById(masterId)
    res.send({ address: master.address, successImageUrl: master.successImageUrl })
  } catch (e) {
    res.send({ address: '', successImageUrl: '' })
  }
})

mastersRouter.put('/info', async (req, res) => {
  const masterId = getMasterId(req)
  const { address, successImageUrl } = req.body
  try {
    await updateMaster(masterId, { address, successImageUrl })
    res.send({ success: true })
  } catch (e) {
    console.log(e)
    res.send({ success: false })
  }
})

module.exports = {
  mastersRouter
}
