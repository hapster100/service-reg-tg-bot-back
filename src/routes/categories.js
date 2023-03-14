const express = require('express')
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../storage/categories')
const { getMasterId } = require('../utils')
const { onlyMaster } = require('./midlwares/onlyMaster')

categoriesRouter = express.Router()

categoriesRouter.get('/', async (req, res) => {
  const masterId = getMasterId(req)
  const categories = await getCategories(masterId)

  res.send(JSON.stringify({ categories }))
})

categoriesRouter.post('/', onlyMaster, async (req, res) => {
  const { category } = req.body
  const masterId = getMasterId(req)
  
  try {
    await addCategory({...category, masterId })
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

categoriesRouter.put('/:id', onlyMaster, async (req, res) => {
  const { id } = req.params
  const { category } = req.body

  if (category.id === id) {
    delete category.id
    try {
      await updateCategory(id, category)
      res.send({ success: true })
    } catch (e) {
      res.send({ success: false })
    }
  } else {
    res.send({ success: false })
  }
})

categoriesRouter.delete('/:id', onlyMaster, async (req, res) => {
  const { id } = req.params
  try {
    await deleteCategory(id)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  categoriesRouter
}
