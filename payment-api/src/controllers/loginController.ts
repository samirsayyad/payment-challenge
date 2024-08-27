import { Request, Response } from 'express'
import { User, IUser } from '../models/User'

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  if (!email || !validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email address' })
    return
  }

  try {
    let user: IUser | null = await User.findOne({ email })

    if (!user) {
      user = new User({ email })
      await user.save()
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        paymentInfo: user.paymentInfo,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' })
  }
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}
