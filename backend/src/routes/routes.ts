import { Router } from 'express'
import thingsRouter from './things.routes'

const router = Router()

router.use('/things', thingsRouter)

export default router