const {
  addToCollection,
  getFromCollectionWhere,
  updateInCollection,
  deleteFromCollection
} = require('./mongoose')
const { deleteService, getServicesByCategoryId } = require('./services')

async function getCategories(masterId) {
  return await getFromCollectionWhere('categories', ['masterId', '==', masterId])
}

async function addCategory(category) {
  return await addToCollection('categories', category)
}

async function updateCategory(id, fields) {
  return await updateInCollection('categories', id, fields)
}

async function deleteCategory(id) {
  const services = await getServicesByCategoryId(id)
  for(const service of services) {
    await deleteService(service.id)
  }
  return await deleteFromCollection('categories', id)
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}
