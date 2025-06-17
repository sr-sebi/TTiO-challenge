import prisma from '../database/prisma'

export class ThingService {
  static async getAllThings() {
    return prisma.thing.findMany({
      include: {
        telemetry: true,
        config: true,
      }
    })
  }

  static async getAllThingsTelemetry() {
    const things = await prisma.thing.findMany({
      include: {
        telemetry: true,
        config: true,
      }
    })
  
    const thingsWithLatestTelemetry = things.map(thing => {
      const latestTelemetryByVariable: Record<string, any> = {}
    
      const sortedTelemetry = thing.telemetry.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
      for (const telemetryData of sortedTelemetry) {
        if (!latestTelemetryByVariable[telemetryData.variable]) {
          latestTelemetryByVariable[telemetryData.variable] = telemetryData;
        }
      }
    
      const latestTelemetryArray = Object.values(latestTelemetryByVariable);
    
      latestTelemetryArray.sort((a, b) => a.variable.localeCompare(b.variable));
    
      return {
        id: thing.id,
        name: thing.name,
        config: thing.config,
        latestTelemetry: latestTelemetryArray
      }
    })
  
    return thingsWithLatestTelemetry;
  }  

  static async createThing(name: string) {
    return prisma.thing.create({
      data: { name }
    })
  }

  static async getThingById(id: number) {
    return prisma.thing.findUnique({
      where: { id },
      include: {
        telemetry: true,
        config: true,
      }
    })
  }

  static async createTelemetryData(thingId: number, variable: string, value: number) {
    return prisma.telemetryData.create({
      data: {
        thingId,
        variable,
        value,
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
        timestamp: 'desc'
      }
    })
  }

  static async updateThingConfig(thingId: number, configData: {
    threshold: number,
    samplingRate: number,
    mode: string
  }) {
    const existingConfig = await prisma.thingConfig.findUnique({ where: { thingId } })

    if (existingConfig) {
      return prisma.thingConfig.update({
        where: { thingId },
        data: configData
      })
    } else {
      return prisma.thingConfig.create({
        data: {
          ...configData,
          thingId
        }
      })
    }
  }
}