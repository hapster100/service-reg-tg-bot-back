const { DEV_MODE } = require("../../config")
const { getMasterById } = require("../../storage/masters")
const { getMasterId, getUserId } = require("../../utils")

async function onlyMaster(req, res, next) {
  const masterId = getMasterId(req)
  const userId = getUserId(req)
  const master = await getMasterById(masterId)
  
  if (DEV_MODE) return next()
  
  if (master && String(master.userId) === String(userId)) {
    return next()
  }

  res.status(403)
  res.end()
}

module.exports = {
  onlyMaster
}
