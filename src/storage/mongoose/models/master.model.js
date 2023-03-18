const { Schema, model } = require('mongoose')
const { STEP } = require('../../../config')

const MasterSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  telegramToken: {
    type: String,
    required: true,
  },
  expiringDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    required: true,
  },
  successImageUrl: {
    type: String,
    default: ''
  },
  shedulleStep: {
    type: Number,
    default: STEP
  }
})

MasterSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id
    return ret
  }
})

const MasterModel = model('Master', MasterSchema)

module.exports = {
  MasterModel
}
