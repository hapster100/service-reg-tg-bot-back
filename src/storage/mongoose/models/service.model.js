const { Schema, model } = require('mongoose')

const ServiceSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  cost: {
    type: Number,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String
  },
  masterId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  }
})

ServiceSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(_, ret) {
    ret.categoryId = ret.categoryId.toHexString()
    delete ret._id
    return ret
  }
})

const ServiceModel = model('Service', ServiceSchema)

module.exports = {
  ServiceModel
}
