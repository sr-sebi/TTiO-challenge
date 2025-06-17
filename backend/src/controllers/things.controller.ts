import { Request, Response, NextFunction } from 'express'
import { ThingService } from '../services/thing.service'

export const getAllThings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ThingService.getAllThings()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getThingDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const thing = await ThingService.getThingById(Number(thingId))

    if (!thing) {
      res.status(404).json({ error: 'Thing not found' })
      return
    }

    res.json(thing)
  } catch (err) {
    next(err)
  }
}

export const addConfigParameter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const { key, value } = req.body

    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key and value are required' })
      return
    }

    const parameter = await ThingService.addConfigParameter(Number(thingId), key, String(value))
    res.status(201).json(parameter)
  } catch (err) {
    next(err)
  }
}

export const addTelemetryVariable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const { name } = req.body

    if (!name) {
      res.status(400).json({ error: 'Variable name is required' })
      return
    }

    const variable = await ThingService.addTelemetryVariable(Number(thingId), name)
    res.status(201).json(variable)
  } catch (err) {
    next(err)
  }
}

export const postThingData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const { variable, value } = req.body

    if (!variable || value === undefined) {
      res.status(400).json({ error: 'Missing data fields' })
      return
    }

    const data = await ThingService.createTelemetryData(Number(thingId), variable, Number(value))
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const postThingTelemetry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const telemetryData = req.body

    if (!telemetryData || !telemetryData.variable || telemetryData.value === undefined) {
      res.status(400).json({ error: 'Invalid telemetry data' })
      return
    }

    const data = await ThingService.createTelemetryData(
      Number(thingId),
      telemetryData.variable,
      Number(telemetryData.value),
    )

    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const getThingVariableHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId, variable } = req.params

    const data = await ThingService.getTelemetryByVariable(Number(thingId), variable)

    if (!data) {
      res.status(404).json({ error: 'No data found for this variable' })
      return
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const updateThingConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const configData = req.body

    if (!configData || typeof configData !== 'object') {
      res.status(400).json({ error: 'Invalid configuration data' })
      return
    }

    const parameters = Object.entries(configData)
      .filter(([key, value]) => key !== 'variables')
      .map(([key, value]) => ({ key, value: String(value) }))

    const variables = Array.isArray(configData.variables) ? configData.variables : []

    const updatedConfig = await ThingService.updateThingConfig(
      Number(thingId),
      parameters,
      variables
    )

    res.json(updatedConfig)
  } catch (err) {
    next(err)
  }
}
