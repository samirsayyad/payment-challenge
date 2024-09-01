import request from 'supertest'
import { app } from '../test-server'
import { User } from '../models/User'

jest.mock('../models/User')

jest.mock('../integration/brainTree', () => ({
  generateToken: jest.fn(),
  createPaymentMethod: jest.fn(),
  saleTransaction: jest.fn(),
}))

jest.mock('../utils/subscription', () => ({
  calculateAmount: jest.fn(),
  calculateSubscriptionEnd: jest.fn(),
}))

describe('POST /api/payment', () => {
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/payment').send({})
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('success', false)
  })

  it('should return 404 if user is not found', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)
    const res = await request(app).post('/api/payment').send({
      paymentMethodNonce: 'nonce',
      subscriptionType: 'type',
      email: 'missing@example.com',
    })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('success', false)
  })
})
