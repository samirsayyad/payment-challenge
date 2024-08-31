import { Request, Response } from 'express'
import { User } from '../models/User'

export const getStatus = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'User email is required' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      subscriptionType: user.subscriptionType,
      expirationDate: user.subscriptionEnd,
      thermometerIncluded: user.thermometerIncluded,
      daysRemaining: calculateDaysRemaining(user.subscriptionEnd),
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

const calculateDaysRemaining = (subscriptionEnd: Date): number => {
  const now = new Date()
  const expiry = new Date(subscriptionEnd)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
