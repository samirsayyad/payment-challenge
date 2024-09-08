import express from 'express'
import {
  paymentController,
  generateClientToken,
} from '../controllers/paymentController'

const router = express.Router()

router.post('/payment', paymentController)
router.post('/payment/token', generateClientToken)

export default router
