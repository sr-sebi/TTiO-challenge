import { Router } from 'express'
import {
  getAllThings,
  getThingDetails,
  postThingData,
  getThingVariableHistory,
  updateThingConfig,
  postThingTelemetry
} from '../controllers/things.controller'

const router = Router()

router.get('/', getAllThings)
router.get('/:thingId', getThingDetails)
router.post('/:thingId', postThingData)
router.patch('/:thingId', updateThingConfig)
router.post('/:thingId/telemetry', postThingTelemetry)
router.get('/:thingId/:variable', getThingVariableHistory)

export default router
