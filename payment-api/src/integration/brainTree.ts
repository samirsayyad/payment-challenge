import braintree from 'braintree'
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

export const generateToken = async (email: string) => {
  try {
    const customer = await findCustomerOnBrainTree(email)
    if (!customer) {
      throw new Error('Customer not found')
    }
    const response = await gateway.clientToken.generate({
      customerId: customer.id,
    })
    return response.clientToken
  } catch (error) {
    console.error('Error generating Braintree client token:', error)
    throw error
  }
}
export const findCustomerOnBrainTree = async (email: string) => {
  const searchResult = await gateway.customer
    .search((search: any) => {
      return search.email().is(email)
    })
    .toArray()
  return searchResult.length > 0 ? searchResult[0] : null
}

export const findOrCreateCustomerOnBrainTree = async (email: string) => {
  try {
    let customer = await findCustomerOnBrainTree(email)
    if (customer) {
      return customer
    }

    const result = await gateway.customer.create({
      email: email,
    })
    if (!result.success) {
      throw new Error('Failed to create customer')
    }
    return result.customer
  } catch (error) {
    console.error('Error in findOrCreateCustomer:', error)
    throw error
  }
}

export const createPaymentMethod = async (
  customerId: string,
  paymentMethodNonce: string,
) => {
  try {
    const result = await gateway.paymentMethod.create({
      customerId,
      paymentMethodNonce,
    })
    if (!result.success) {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    console.error('Error in createPaymentMethod:', error)
    throw error
  }
}

export const saleTransaction = async (
  customerId: string,
  paymentMethodToken: string,
  amount: string,
) => {
  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodToken,
      customerId,
      options: {
        submitForSettlement: true,
      },
    })
    if (!result.success) {
      throw new Error(result.message)
    }
    return result
  } catch (error) {
    console.error('Error in saleTransaction:', error)
    throw error
  }
}
