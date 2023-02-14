const {
  getAllFromCollectoion,
  addToCollection,
} = require('./firebase')

async function getCategories() {
  return await getAllFromCollectoion('categories')
}

async function addCategory(category) {
  return await addToCollection('categories', category)
}

module.exports = {
  getCategories,
  addCategory,
}
