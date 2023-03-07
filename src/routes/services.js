const express = require('express')
const { addBase64Image, deleteImage } = require('../storage/images')
const { getServices, getService, addService, deleteService } = require('../storage/services')
const { getMasterId } = require('../utils')

servicesRouter = express.Router()

servicesRouter.get('/', async (req, res) => {
  const masterId = getMasterId(req)
  const services = await getServices(masterId)
  res.send(JSON.stringify({ services }))
})

servicesRouter.post('/', async (req, res) => {
  const { service } = req.body
  const masterId = getMasterId(req)

  try {
    const { imageUrl } = service
    if (imageUrl && /data:image\/[a-z]*;base64/i.test(imageUrl)) {
      const image = await addBase64Image(imageUrl)
      service.imageUrl = `https://aland97.ru/img/${image.id}`
    }
    await addService({...service, masterId})
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

servicesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const service = await getService(id)
  res.send(JSON.stringify({ service }))
})

servicesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const service = await getService(id)
    if (service.imageUrl.startsWith('https://aland97.ru/img/')) {
      const imgId = service.imageUrl.match(/(?<=\/img\/).*/)?.[0]
      await deleteImage(imgId)
    }
    await deleteService(id)
    res.send({ success: true })
  } catch (e) {
    res.send({ success: false })
  }
})

module.exports = {
  servicesRouter
}
