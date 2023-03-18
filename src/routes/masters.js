const express = require('express')
const { STEP } = require('../config')
const { getMasterById, updateMaster } = require('../storage/masters')
const { getMasterId } = require('../utils')
const { onlyMaster } = require('./midlwares/onlyMaster')

mastersRouter = express.Router()

mastersRouter.get('/info', async (req, res) => {
  const masterId = getMasterId(req)
  try {
    const master = await getMasterById(masterId)
    res.send({
      address: master.address,
      successImageUrl: master.successImageUrl,
      shedulleStep: master.shedulleStep || STEP
    })
  } catch (e) {
    res.send({ address: '', successImageUrl: '' })
  }
})

mastersRouter.put('/info', onlyMaster, async (req, res) => {
  const masterId = getMasterId(req)
  const { address, successImageUrl, shedulleStep } = req.body
  try {
    await updateMaster(masterId, { address, successImageUrl, shedulleStep })
    res.send({ success: true })
  } catch (e) {
    console.log(e)
    res.send({ success: false })
  }
})

module.exports = {
  mastersRouter
}
