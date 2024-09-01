import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import { findOrCreateCustomerOnBrainTree } from '../integration/brainTree'
import { validateEmail } from '../utils/email'

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  if (!email || !validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email address' })
    return
  }
  try {
    let user: IUser | null = await User.findOne({ email })

    if (!user) {
      const brainTreeCustomer = await findOrCreateCustomerOnBrainTree(email)
      user = new User({ email })
      user.brainTreeCustomerId = brainTreeCustomer.id
      await user.save()
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' })
  }
}
