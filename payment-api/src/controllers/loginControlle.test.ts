import request from 'supertest'
import { app } from '../test-server'
import { User } from '../models/User'

jest.mock('../models/User')

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if email is not provided', async () => {
    const res = await request(app).post('/api/login').send({ email: '' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 400 if email is not valid', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'invalidEmail' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 200 and create a new user if user does not exist', async () => {
    ;(User.findOne as jest.Mock).mockResolvedValue(null)

    const email = 'test@example.com'
    const res = await request(app).post('/api/login').send({ email })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'Login successful')
  })

  it('should return 200 if user exists', async () => {
    const email = 'existing@example.com'
    ;(User.findOne as jest.Mock).mockResolvedValue({ email })

    const res = await request(app).post('/api/login').send({ email })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'Login successful')
  })

  it('should return 500 if there is a server error', async () => {
    ;(User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'))

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'error@example.com' })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toHaveProperty('error')
  })
})
