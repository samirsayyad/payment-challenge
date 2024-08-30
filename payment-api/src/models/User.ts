import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  email: string
  subscriptionType?: 'Monthly' | 'Yearly'
  thermometerIncluded?: boolean
  lastPaymentDate?: Date
  subscriptionEnd: Date
  subscriptionStatus: boolean
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  subscriptionType: { type: String, required: false },
  includeThermometer: { type: Boolean, required: false },
  subscriptionStatus: { type: String, required: false, default: 'deactive' },
  subscriptionEnd: { type: Date, required: false },
})

const User = mongoose.model<IUser>('User', UserSchema)

export { User, IUser }
