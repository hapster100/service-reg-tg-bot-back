const mongoose = require('mongoose')
const { MONGODB_CONNECT_STR } = require('../../config')
const { CategoryModel } = require('./models/category.model')
const { ImageModel } = require('./models/image.model')
const { MasterModel } = require('./models/master.model')
const { NotifyModel } = require('./models/notify.model')
const { OrderModel } = require('./models/order.model')
const { ServiceModel } = require('./models/service.model')
const { ShedulleModel } = require('./models/shedulle.model')
const { UserModel } = require('./models/user.model')

let connect = mongoose.connect(MONGODB_CONNECT_STR)

const setConnection = async connectString => {
  await mongoose.disconnect()
  connect = mongoose.connect(connectString)
}

const getModel = name => ({
  'users': UserModel,
  'categories': CategoryModel,
  'services': ServiceModel,
  'orders': OrderModel,
  'shedulle': ShedulleModel,
  'masters': MasterModel,
  'notifies': NotifyModel,
  'images': ImageModel,
})[name]

const item = doc => {
  const item = doc.toObject()
  return item
}

const addToCollection = async (name, fields) => {
  await connect
  const Model = getModel(name)
  const newItem = new Model(fields)
  await newItem.save()
  return item(newItem)
}

const getAllFromCollectoion = async (name) => {
  await connect
  const Model = getModel(name)
  const docs = await Model.find()
  return docs ? docs.map(item) : []
}

const getFromCollectionWhere = async (name, ...wheres) => {
  await connect
  const Model = getModel(name)
  const filter = {}
  for(const [f, c, v] of wheres) {
    if (!filter[f]) filter[f] = {}
    switch (c) {
      case '==':
        filter[f].$eq = v
        break
      case '<=':
        filter[f].$lte = v
        break
      case '>=': 
        filter[f].$gte = v
        break
      case '>':
        filter[f].$gt = v
        break
      case '<':
        filter[f].$lt = v
        break
    }
  }
  const docs = await Model.find(filter)
  return docs ? docs.map(item) : []
}

const updateInCollection = async (name, id, fields) => {
  await connect
  const Model = getModel(name)
  await Model.findByIdAndUpdate(id, fields)
}

const deleteFromCollection = async (name, id) => {
  await connect
  const Model = getModel(name)
  await Model.findByIdAndDelete(id)
}

const existsInCollection = async (name, id) => {
  await connect
  const Model = getModel(name)
  return null !== await Model.findById(id)
}

const setToCollection = async (name, id, item) => {
  await connect
  const Model = getModel(name)
  const newItem = new Model({...item, _id: id})
  await newItem.save()
}

const getById = async (name, id) => {
  await connect
  const Model = getModel(name)
  const doc = await Model.findById(id)
  return doc ? item(doc) : null
}

const getByIds = async (name, ids) => {
  await connect
  const Model = getModel(name)
  const docs = await Model.find({ _id: ids })
  return docs ? docs.map(item) : []
}

module.exports = {
  addToCollection,
  getAllFromCollectoion,
  updateInCollection,
  deleteFromCollection,
  existsInCollection,
  setToCollection,
  getById,
  getByIds,
  getFromCollectionWhere,
  setConnection,
}