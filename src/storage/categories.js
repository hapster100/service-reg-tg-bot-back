const {
  addToCollection,
  getFromCollectionWhere,
  updateInCollection,
} = require('./mongoose')
const { deleteService, getServicesByCategoryId } = require('./services')

function filterDeleted(category) {
  return !category.deleted
}

async function getCategories(masterId) {
  const categories = await getFromCollectionWhere('categories',
    ['masterId', '==', masterId]
  )
  return categories.filter(filterDeleted)
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
  return await updateCategory(id, {
    deleted: true,
  })
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}
