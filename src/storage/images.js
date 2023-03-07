const { addToCollection, deleteFromCollection, getById } = require("./mongoose")

async function addBase64Image(base64) {
  const type = base64.match(/image\/.*?(?=;)/)?.[0] ?? 'image/png'
  const data = Buffer.from(base64.replace(/.*base64,/, ''), 'base64')
  return await addToCollection('images', {
    data,
    type
  })
}

async function getImage(id) {
  return await getById('images', id)
}

async function deleteImage(id) {
  return await deleteFromCollection('images', id)
}

module.exports = {
  addBase64Image,
  deleteImage,
  getImage,
}
