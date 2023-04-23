const {
  getById, addToCollection,
  getFromCollectionWhere, updateInCollection
} = require('./mongoose')
const { replaceImage } = require('./images')

function filterDeleted(service) {
  return !service.deleted
}

async function getServices(masterId) {
  const services = await getFromCollectionWhere('services',
    ['masterId', '==', masterId]
  )
  return services.filter(filterDeleted)
}

async function getService(id) {
  return await getById('services', id)
}

async function deleteService(id) {
  const service = await getService(id)
  await replaceImage(service.imageUrl, '')
  return await updateService(id, {
    deleted: true,
    imageUrl: '',
  })
}

async function addService(service) {
  service.imageUrl = await replaceImage('', service.imageUrl)
  return await addToCollection('services', service)
}

async function updateService(id, service) {
  const oldService = await getService(id)
  service.imageUrl = await replaceImage(oldService.imageUrl, service.imageUrl)
  return await updateInCollection('services', id, service)
}

async function getServicesByCategoryId(categoryId) {
  const services = await getFromCollectionWhere('services',
    ['categoryId', '==', categoryId]
  );
  return services.filter(filterDeleted)
}

module.exports = {
  getServices,
  getService,
  addService,
  deleteService,
  getServicesByCategoryId,
  updateService,
}
