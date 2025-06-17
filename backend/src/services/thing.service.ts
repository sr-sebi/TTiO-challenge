import prisma from '../database/prisma'

export class ThingService {
  static async getAllThings() {
    const things = await prisma.thing.findMany({
      include: {
        telemetry: true,
        config: {
          include: {
            parameters: true,
            variables: true,
          }
        }
      }
    })

    const thingsWithLatestTelemetry = things.map(thing => {
      const latestTelemetryByVariable: Record<string, any> = {}

      const sortedTelemetry = thing.telemetry.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      for (const telemetryData of sortedTelemetry) {
        if (!latestTelemetryByVariable[telemetryData.variable]) {
          latestTelemetryByVariable[telemetryData.variable] = telemetryData
        }
      }

      const latestTelemetryArray = Object.values(latestTelemetryByVariable)
      latestTelemetryArray.sort((a, b) => a.variable.localeCompare(b.variable))

      return {
        id: thing.id,
        name: thing.name,
        config: thing.config,
        latestTelemetry: latestTelemetryArray
      }
    })

    return thingsWithLatestTelemetry
  }

  static async getThingById(id: number) {
    return prisma.thing.findUnique({
      where: { id },
      include: {
        telemetry: true,
        config: {
          include: {
            parameters: true,
            variables: true,
          }
        }
      }
    })
  }

  static async addConfigParameter(thingId: number, key: string, value: string) {
    const thing = await prisma.thing.findUnique({
      where: { id: thingId },
      include: { config: true }
    })

    if (!thing || !thing.configId) throw new Error('Thing or config not found')

    return prisma.configParameter.create({
      data: {
        key,
        value,
        configId: thing.configId
      }
    })
  }

  static async addTelemetryVariable(thingId: number, name: string) {
    const thing = await prisma.thing.findUnique({
      where: { id: thingId },
      include: { config: true }
    })

    if (!thing || !thing.configId) throw new Error('Thing or config not found')

    return prisma.telemetryVariable.create({
      data: {
        name,
        configId: thing.configId
      }
    })
  }

  static async createTelemetryData(thingId: number, variable: string, value: number) {
    const thing = await prisma.thing.findUnique({
      where: { id: thingId },
      include: {
        config: {
          include: {
            variables: true
          }
        }
      }
    })

    if (!thing || !thing.config) {
      throw new Error('Thing or config not found')
    }

    const allowedVariables = thing.config.variables.map(v => v.name)
    if (!allowedVariables.includes(variable)) {
      throw new Error(`Variable "${variable}" is not defined in the thing's config`)
    }

    return prisma.telemetryData.create({
      data: {
        thingId,
        variable,
        value
      }
    })
  }

  static async getTelemetryByVariable(thingId: number, variable: string) {
    return prisma.telemetryData.findMany({
      where: {
        thingId,
        variable
      },
      orderBy: {
        timestamp: 'asc'
      }
    })
  }

  static async updateThingConfig(thingId: number, parameters: { key: string, value: string }[]) {
    let config = await prisma.thingConfig.findFirst({ where: { thing: { id: thingId } } })

    if (!config) {
      config = await prisma.thingConfig.create({
        data: {
          thing: { connect: { id: thingId } },
          parameters: { create: parameters.map(p => ({ key: p.key, value: p.value })) },
        }
      })
    } else {
      await prisma.configParameter.deleteMany({ where: { configId: config.id } })
      await prisma.telemetryVariable.deleteMany({ where: { configId: config.id } })

      config = await prisma.thingConfig.update({
        where: { id: config.id },
        data: {
          parameters: { create: parameters.map(p => ({ key: p.key, value: p.value })) },
        }
      })
    }

    config = await prisma.thingConfig.findUnique({
      where: { id: config.id },
      include: {
        parameters: true,
        variables: true,
      }
    })

    return config
  }
}
