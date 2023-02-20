const express = require('express')
const { getMonthShedulle, updateMonthShedulle } = require('../storage/shedulle')

const shedulleRouter = express.Router()

shedulleRouter.post('/', async (req, res) => {
  const { month, year } = req.body
  try {
    const shedulle = await getMonthShedulle(year, month)
    res.send({ shedulle })
  } catch(e) {
    res.send({ shedulle: {} })
  }
})

shedulleRouter.put('/', async (req, res) => {
  const { month, year, shedulle } = req.body
  try {
    await updateMonthShedulle(year, month, shedulle)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  shedulleRouter,
}
