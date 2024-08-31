import { Request, Response } from 'express'
import braintree from 'braintree'
import { User, IUser } from '../models/User'
import dotenv from 'dotenv'
import { CustomerCreateRequest } from 'braintree'
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
      user.brainTreeCustomerId = await findOrCreateCustomerOnBrainTree(email)
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

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

const findOrCreateCustomerOnBrainTree = async (email: string) => {
  try {
    const searchResult = await gateway.customer
      .search((search: braintree.CustomerCreateRequest) => {
        return search.email === email
      })
      .toArray()

    if (searchResult.length > 0) {
      return searchResult[0]
    }

    const result = await gateway.customer.create({
      email: email,
    })
    console.log('result:', result)
    if (result.success) {
      return result.customer.id
    } else {
      throw new Error('Failed to create customer')
    }
  } catch (error) {
    console.error('Error in findOrCreateCustomer:', error)
    throw error
  }
}
