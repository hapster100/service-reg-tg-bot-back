const { HOST } = require("../config")
const { addToCollection, deleteFromCollection, getById } = require("./mongoose")

async function addBase64Image(base64) {
  const type = base64.match(/image\/.*?(?=;)/)?.[0] ?? 'image/png'
  const data = Buffer.from(base64.replace(/.*base64,/, ''), 'base64')
  const image = await addToCollection('images', {
    data,
    type
  })
  console.log('new image', image.id)
  return image
}

async function getImage(id) {
  return await getById('images', id)
}

async function deleteImage(id) {
  console.log('delete image', id)
  return await deleteFromCollection('images', id)
}

async function replaceImage(oldUrl, newUrl) {
  if (oldUrl !== newUrl) {
    if (oldUrl !== newUrl) {
      if (oldUrl.startsWith(`${HOST}/img/`)) {
        const imgId = oldUrl.match(/(?<=\/img\/).*/)?.[0]
        await deleteImage(imgId)
      }
      if (newUrl && /data:image\/[a-z]*;base64/i.test(newUrl)) {
        const image = await addBase64Image(newUrl)
        return `${HOST}/img/${image.id}`
      }
    }
  }
  return newUrl
}

module.exports = {
  replaceImage,
  addBase64Image,
  deleteImage,
  getImage,
}
