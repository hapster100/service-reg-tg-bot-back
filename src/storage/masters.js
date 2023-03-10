const { replaceImage } = require("./images");
const { getFromCollectionWhere, getById, updateInCollection } = require("./mongoose");

async function getMasterByUserId(userId) {
  return await getFromCollectionWhere('masters', ['userId', '==', userId])
}

async function getMasterById(id) {
  return await getById('masters', id)
}

async function updateMaster(id, fields) {
  const oldMaster = await getMasterById(id)
  fields.successImageUrl = await replaceImage(
    oldMaster.successImageUrl, fields.successImageUrl
  )
  return await updateInCollection('masters', id, fields)
}

module.exports = {
  getMasterById,
  getMasterByUserId,
  updateMaster
}
