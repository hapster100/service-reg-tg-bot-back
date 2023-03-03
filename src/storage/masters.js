const { getFromCollectionWhere, getById } = require("./mongoose");

async function getMasterByUserId(userId) {
  return await getFromCollectionWhere('masters', ['userId', '==', userId])
}

async function getMasterById(id) {
  return await getById('masters', id)
}

module.exports = {
  getMasterById,
  getMasterByUserId,
}
