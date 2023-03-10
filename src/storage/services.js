const { getById, addToCollection, getFromCollectionWhere, deleteFromCollection, updateInCollection } = require('./mongoose')
const { replaceImage } = require('./images')
async function getServices(masterId) {
  return await getFromCollectionWhere('services', ['masterId', '==', masterId])
}

async function getService(id) {
  return await getById('services', id)
}

async function deleteService(id) {
  const service = await getService(id)
  await replaceImage(service.imageUrl, '')
  return await deleteFromCollection('services', id)
}

async function addService(service) {
  const { imageUrl } = service
  service.imageUrl = await replaceImage('', service.imageUrl)
  return await addToCollection('services', service)
}

async function updateService(id, service) {
  const oldService = await getService(id)
  service.imageUrl = await replaceImage(oldService.imageUrl, service.imageUrl)
  return await updateInCollection('services', id, service)
}

async function getServicesByCategoryId(categoryId) {
  return await getFromCollectionWhere('services', ['categoryId', '==', categoryId])
}

module.exports = {
  getServices,
  getService,
  addService,
  deleteService,
  getServicesByCategoryId,
  updateService,
}
