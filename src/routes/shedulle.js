const express = require('express')
const { getMonthShedulle, updateMonthShedulle } = require('../storage/shedulle')
const { getMasterId } = require('../utils')
const { onlyMaster } = require('./midlwares/onlyMaster')

const shedulleRouter = express.Router()

shedulleRouter.post('/', async (req, res) => {
  const { month, year } = req.body
  const masterId = getMasterId(req)
  try {
    const shedulle = await getMonthShedulle(year, month, masterId)
    res.send({ shedulle })
  } catch(e) {
    res.send({ shedulle: {} })
  }
})

shedulleRouter.put('/', onlyMaster, async (req, res) => {
  const { month, year, shedulle } = req.body
  const masterId = getMasterId(req)
  try {
    await updateMonthShedulle(year, month, masterId, shedulle)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  shedulleRouter,
}
