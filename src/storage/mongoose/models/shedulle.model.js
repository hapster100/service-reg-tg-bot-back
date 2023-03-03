const { Schema, model } = require('mongoose')

const ShedulleSchema = new Schema({
  _id: String,
}, { strict: false })

ShedulleSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id
    return ret
  }
})

const ShedulleModel = model('Shedulle', ShedulleSchema)

module.exports = {
  ShedulleModel
}
