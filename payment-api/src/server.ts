import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import loginRoutes from './routes/loginRoute'
import paymentRoutes from './routes/paymentRoute'
import statusRoutes from './routes/statusRoute'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not defined')
}

const mongoUri: string = process.env.MONGO_URI

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('OK')
})
app.use('/api', loginRoutes)
app.use('/api', paymentRoutes)
app.use('/api', statusRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
