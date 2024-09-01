import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import loginRoutes from './routes/loginRoute'
import paymentRoutes from './routes/paymentRoute'
import statusRoutes from './routes/statusRoute'
import bodyParser from 'body-parser'

dotenv.config()

export const app = express()

app.use(cors())
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('OK')
})
app.use('/api', loginRoutes)
app.use('/api', paymentRoutes)
app.use('/api', statusRoutes)
