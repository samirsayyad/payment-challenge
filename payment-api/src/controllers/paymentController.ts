import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import {
  generateToken,
  createPaymentMethod,
  saleTransaction,
} from '../integration/brainTree'
import {
  calculateAmount,
  calculateSubscriptionEnd,
} from '../utils/subscription'

export const generateClientToken = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const clientToken = await generateToken(email)
    res.status(200).json({ clientToken })
  } catch (error) {
    console.error('Error generating Braintree client token:', error)
    res.status(500).json({ error: 'Failed to generate client token' })
  }
}
export const paymentController = async (req: Request, res: Response) => {
  const { paymentMethodNonce, subscriptionType, includeThermometer, email } =
    req.body

  try {
    if (!paymentMethodNonce || !subscriptionType || !email) {
      res
        .status(400)
        .json({ success: false, message: 'Missing required fields' })
      return
    }
    const subscriptionEnd = calculateSubscriptionEnd(subscriptionType)

    let user: IUser | null = await User.findOne({ email })

    if (!user || !user.brainTreeCustomerId) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    const paymentMethodResult = await createPaymentMethod(
      user.brainTreeCustomerId,
      paymentMethodNonce,
    )

    const transactionResult = await saleTransaction(
      user.brainTreeCustomerId,
      paymentMethodResult.paymentMethod.token,
      calculateAmount(subscriptionType, includeThermometer),
    )

    if (transactionResult.success) {
      await User.updateOne(
        { email },
        {
          subscriptionType,
          includeThermometer,
          subscriptionStatus: 'active',
          subscriptionEnd,
          transactionId: transactionResult.transaction.id,
        },
        { upsert: true },
      )
      res.json({ success: true })
    } else {
      res.json({ success: false, message: transactionResult.message })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}
