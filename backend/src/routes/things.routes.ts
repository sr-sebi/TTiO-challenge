import { Router } from 'express'
import {
  getAllThings,
  getThingDetails,
  postThingData,
  postThingTelemetry,
  getThingVariableHistory,
  updateThingConfig,
  addConfigParameter,
  addTelemetryVariable
} from '../controllers/things.controller'

const router = Router()

// GET /things → lista de todas las cosas
router.get('/', getAllThings)

// GET /things/:thingId → detalle de una cosa
router.get('/:thingId', getThingDetails)

// POST /things/:thingId → crear dato de telemetría simple (variable + value)
router.post('/:thingId', postThingData)

// POST /things/:thingId/telemetry → crear dato de telemetría completo
router.post('/:thingId/telemetry', postThingTelemetry)

// GET /things/:thingId/:variable → histórico de una variable
router.get('/:thingId/:variable', getThingVariableHistory)

// PATCH /things/:thingId → actualizar configuración completa
router.patch('/:thingId', updateThingConfig)

// POST /things/:thingId/config/parameter → añadir parámetro individual
router.post('/:thingId/config/parameter', addConfigParameter)

// POST /things/:thingId/config/variable → añadir variable de telemetría
router.post('/:thingId/config/variable', addTelemetryVariable)

export default router
