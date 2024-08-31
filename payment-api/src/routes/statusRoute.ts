import { Router } from 'express'
import { getStatus } from '../controllers/statusController'

const router = Router()

router.post('/status', getStatus)

export default router
