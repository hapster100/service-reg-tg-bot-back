const { getById, addToCollection, getFromCollectionWhere, deleteFromCollection, updateInCollection } = require('./mongoose')
const { deleteImage, addBase64Image } = require('./images')
async function getServices(masterId) {
  return await getFromCollectionWhere('services', ['masterId', '==', masterId])
}

async function getService(id) {
  return await getById('services', id)
}

async function deleteService(id) {
  
  const service = await getService(id)
  if (service.imageUrl.startsWith('https://aland97.ru/img/')) {
    const imgId = service.imageUrl.match(/(?<=\/img\/).*/)?.[0]
    await deleteImage(imgId)
  }

  return await deleteFromCollection('services', id)
}

async function addService(service) {
  const { imageUrl } = service
  
  if (imageUrl && /data:image\/[a-z]*;base64/i.test(imageUrl)) {
    const image = await addBase64Image(imageUrl)
    service.imageUrl = `https://aland97.ru/img/${image.id}`
  }

  return await addToCollection('services', service)
}

async function updateService(id, service) {
  const oldService = await getService(id)

  if (oldService.imageUrl !== service.imageUrl) {
    if (oldService.imageUrl.startsWith('https://aland97.ru/img/')) {
      const imgId = oldService.imageUrl.match(/(?<=\/img\/).*/)?.[0]
      await deleteImage(imgId)
    }
    if (service.imageUrl && /data:image\/[a-z]*;base64/i.test(service.imageUrl)) {
      const image = await addBase64Image(service.imageUrl)
      service.imageUrl = `https://aland97.ru/img/${image.id}`
    }
  }

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
