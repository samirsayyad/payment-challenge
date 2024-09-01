import request from 'supertest'
import { app } from '../test-server'
import { User } from '../models/User'

jest.mock('../models/User')

jest.mock('../integration/brainTree', () => ({
  findCustomerOnBrainTree: jest.fn(),
}))

jest.mock('../utils/subscription', () => ({
  calculateDaysRemaining: jest.fn(),
}))

describe('Post /api/status', () => {
  it('should return 400 if email is not provided', async () => {
    const res = await request(app).post('/api/status').send({ email: '' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message', 'User email is required')
  })

  it('should return 404 if user is not found', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)
    const res = await request(app)
      .post('/api/status')
      .send({ email: 'missing@example.com' })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('message', 'User not found')
  })
})
