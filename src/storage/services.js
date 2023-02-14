const { getAllFromCollectoion, getById, addToCollection } = require('./firebase')

async function getServices() {
  return await getAllFromCollectoion('services')
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
