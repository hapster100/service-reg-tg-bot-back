const { Schema, model } = require('mongoose')

const OrderTimeSchema = new Schema({
  hours: {
    type: Number,
    required: true
  },
  minutes: {
    type: Number,
    required: true
  }
}, { _id: false })

const OrderSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  masterId: {
    type: String,
    required: true
  },
  serviceIds: {
    type: Schema.Types.Array,
    of: {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    }
  },
  time: {
    type: OrderTimeSchema,
    required: true
  },
  userId: {
    type: String,
    ref: 'User'
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

OrderSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(_, ret) {
    delete ret._id
    return ret
  }
})

const OrderModel = model('Order', OrderSchema)

module.exports = {
  OrderModel
}
