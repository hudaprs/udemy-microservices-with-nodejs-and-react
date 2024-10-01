import mongoose from 'mongoose'
import { SecurityService } from '@/services/security.service'

interface UserBuildAttrs {
  email: string
  password: string
}

interface UserDocument extends mongoose.Document {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDocument> {
  build: (attrs: UserBuildAttrs) => UserDocument
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        delete ret.__v
        delete ret.password
      }
    }
  }
)

userSchema.statics.build = (attrs: UserBuildAttrs) => {
  return new User(attrs)
}

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const encryptedPassword = SecurityService.encryptData(this.get('password'))
    this.set('password', encryptedPassword)
  }

  done()
})

const User = mongoose.model<UserDocument, UserModel>('User', userSchema)

export { User }
