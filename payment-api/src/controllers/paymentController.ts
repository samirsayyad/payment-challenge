import { Request, Response } from 'express'
import braintree from 'braintree'
import { User } from '../models/User'
import dotenv from 'dotenv'
dotenv.config()

if (
  !process.env.BRAINTREE_MERCHANT_ID ||
  !process.env.BRAINTREE_PUBLIC_KEY ||
  !process.env.BRAINTREE_PRIVATE_KEY
) {
  throw new Error('BRAINTREE environment variable is not defined')
}

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

export const generateClientToken = async (_: Request, res: Response) => {
  try {
    const response = await gateway.clientToken.generate({})
    res.status(200).json({ clientToken: response.clientToken })
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
    const transactionResult = await gateway.transaction.sale({
      amount: calculateAmount(subscriptionType, includeThermometer),
      paymentMethodNonce: paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    })

    if (transactionResult.success) {
      const subscriptionEnd = calculateSubscriptionEnd(subscriptionType)
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

const calculateAmount = (
  subscriptionType: string,
  includeThermometer: boolean,
): string => {
  let amount = subscriptionType === 'monthly' ? 9.9 : 79.9
  if (includeThermometer) amount += 14.9
  return amount.toFixed(2)
}

const calculateSubscriptionEnd = (subscriptionType: string): Date => {
  const now = new Date()
  if (subscriptionType === 'monthly') {
    return new Date(now.setMonth(now.getMonth() + 1))
  } else {
    return new Date(now.setFullYear(now.getFullYear() + 1))
  }
}
