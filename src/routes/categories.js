const express = require('express')
const { getCategories, addCategory } = require('../storage/categories')
const { getMasterId } = require('../utils')

categoriesRouter = express.Router()

categoriesRouter.get('/', async (req, res) => {
  const masterId = getMasterId(req)
  const categories = await getCategories(masterId)

  res.send(JSON.stringify({ categories }))
})

categoriesRouter.post('/', async (req, res) => {
  const { category } = req.body
  const masterId = getMasterId(req)
  
  try {
    await addCategory({...category, masterId })
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  categoriesRouter
}
