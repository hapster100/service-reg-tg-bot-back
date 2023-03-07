const { Schema, model } = require('mongoose')

const NotifySchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  }
})

NotifySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id
    return ret
  }
})

const NotifyModel = model('Notify', NotifySchema)

module.exports = {
  NotifyModel
}
