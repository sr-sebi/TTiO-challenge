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
    const { variable, value, timestamp } = req.body

    if (!variable || value === undefined || !timestamp) {
      res.status(400).json({ error: 'Missing data fields' })
      return
    }

    const data = await ThingService.createTelemetryData(
      Number(thingId),
      variable,
      Number(value),
      new Date(timestamp)
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

    res.json(data)
  } catch (err) {
    next(err)
  }
}
