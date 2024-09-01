import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import { findCustomerOnBrainTree } from '../integration/brainTree'
import { calculateDaysRemaining } from '../utils/subscription'
export const getStatus = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'User email is required' })
  }

  try {
    let user: IUser | null = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const brainTreeCustomer = await findCustomerOnBrainTree(email)
    if (!brainTreeCustomer) {
      return res
        .status(404)
        .json({ message: 'User not found in payment gateway' })
    }

    const subscription = brainTreeCustomer.paymentMethods.find(
      (method: any) => method.default,
    )
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    res.json({
      subscriptionType: user.subscriptionType,
      expirationDate: user.subscriptionEnd,
      includeThermometer: user.includeThermometer,
      daysRemaining: calculateDaysRemaining(user.subscriptionEnd),
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
