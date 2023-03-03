const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
})

UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(_, ret) {
    delete ret._id
    return ret
  }
})

module.exports = {
  UserModel: model('User', UserSchema)
}
