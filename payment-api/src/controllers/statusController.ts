import { Request, Response } from 'express'
import { User } from '../models/User'

export const getStatus = async (req: Request, res: Response) => {
  const { userEmail } = req.query

  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' })
  }

  try {
    const user = await User.findOne({ email: userEmail })

    if (!user || !user.paymentInfo) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      subscriptionType: user.paymentInfo.subscriptionType,
      expirationDate: user.paymentInfo.subscriptionEnd,
      thermometerIncluded: user.paymentInfo.thermometerIncluded,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
