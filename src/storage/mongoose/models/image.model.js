const { Schema, model } = require('mongoose')

const ImageSchema = new Schema({
  data: {
    type: Buffer,
    required: true
  },
  imgType: {
    type: String,
    default: 'image/png'
  }
})

ImageSchema.set('toObject', {
  versionKey: false,
  virtuals: true,
  transform: function(_, ret) {
    delete ret._id
    return ret
  }
})

const ImageModel = model('Image', ImageSchema)

module.exports = {
  ImageModel
}
