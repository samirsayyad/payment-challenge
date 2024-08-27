import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  email: string
  paymentInfo?: {
    subscriptionType?: 'Monthly' | 'Yearly'
    thermometerIncluded?: boolean
    lastPaymentDate?: Date
    subscriptionEnd: Date
  }
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  subscriptionType: { type: String, required: false },
  includeThermometer: { type: Boolean, required: false },
  subscriptionStatus: { type: String, required: false },
  subscriptionEnd: { type: Date, required: false },
})

const User = mongoose.model<IUser>('User', UserSchema)

export { User, IUser }
