const { getFromCollectionWhere, addToCollection, getAllFromCollectoion, deleteFromCollection } = require("./mongoose");

async function getNotifysBefore(date) {
  return await getFromCollectionWhere('notifies', ['date', '<=', date])
}

async function gettAllNotifys() {
  return await getAllFromCollectoion('notifies')
}

async function addNotify(orderId, text, date) {
  const notify = {
    orderId,
    text,
    date,
  }
  return await addToCollection('notifies', notify)
}

async function deleteOrderNotifys(orderId) {
  const notifys = await getFromCollectionWhere('notifies', ['orderId', '==', orderId])
  for(const notify of notifys) {
    await deleteFromCollection('notifies', notify.id)
  }
}

async function deleteNotify(id) {
  return await deleteFromCollection('notifies', id)
}

module.exports = {
  gettAllNotifys,
  getNotifysBefore,
  addNotify,
  deleteOrderNotifys,
  deleteNotify,
}
