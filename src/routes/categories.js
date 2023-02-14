const express = require('express')
const { getCategories, addCategory } = require('../storage/categories')

categoriesRouter = express.Router()

categoriesRouter.get('/', async (_, res) => {
  const categories = await getCategories()
  res.send(JSON.stringify({ categories }))
})

categoriesRouter.post('/', async (req, res) => {
  const { category } = req.body
  try {
    await addCategory(category)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})


module.exports = {
  categoriesRouter
}
