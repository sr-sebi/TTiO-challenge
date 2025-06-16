import { Router } from 'express'
import {
  getAllThings,
  getThingDetails,
  postThingData,
  getThingVariableHistory
} from '../controllers/things.controller'

const router = Router()

router.get('/', getAllThings)
router.get('/:thingId', getThingDetails)
router.post('/:thingId', postThingData)
router.get('/:thingId/:variable', getThingVariableHistory)

export default router
