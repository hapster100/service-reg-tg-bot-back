const { getById, addToCollection, getFromCollectionWhere } = require('./mongoose')

async function getServices(masterId) {
  return await getFromCollectionWhere('services', ['masterId', '==', masterId])
}

async function getService(id) {
  return await getById('services', id)
}

async function addService(service) {
  return await addToCollection('services', service)
}

module.exports = {
  getServices,
  getService,
  addService,
}
