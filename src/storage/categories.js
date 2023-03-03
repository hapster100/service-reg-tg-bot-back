const {
  addToCollection,
  getFromCollectionWhere,
} = require('./mongoose')

async function getCategories(masterId) {
  return await getFromCollectionWhere('categories', ['masterId', '==', masterId])
}

async function addCategory(category) {
  return await addToCollection('categories', category)
}

module.exports = {
  getCategories,
  addCategory,
}
