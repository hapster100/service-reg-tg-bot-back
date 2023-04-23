const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
  masterId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

CategorySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(_,ret) {
    delete ret._id
    return ret
  }
})

const CategoryModel = model('Category', CategorySchema)

module.exports = {
  CategoryModel
}
