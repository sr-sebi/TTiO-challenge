import { Request, Response, NextFunction } from 'express'
import { ThingService } from '../services/thing.service'

export const getAllThings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const things = await ThingService.getAllThings()
    res.json(things)
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

export const postThingData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thingId } = req.params
    const { variable, value } = req.body

    if (!variable || value === undefined) {
      res.status(400).json({ error: 'Missing data fields' })
      return
    }

    const data = await ThingService.createTelemetryData(
      Number(thingId),
      variable,
      Number(value),
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

    if (!configData || !configData.threshold || !configData.samplingRate || !configData.mode) {
      res.status(400).json({ error: 'Invalid configuration data' })
      return
    }

    const updatedConfig = await ThingService.updateThingConfig(Number(thingId), configData)

    res.json(updatedConfig)
  } catch (err) {
    next(err)
  }
}
