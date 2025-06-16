import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const thing1 = await prisma.thing.create({
    data: {
      name: 'Sensor A',
      config: {
        create: {
          threshold: 30.5,
          samplingRate: 5,
          mode: 'auto'
        }
      },
      telemetry: {
        createMany: {
          data: [
            {
              variable: 'temperature',
              value: 22.5,
              timestamp: new Date()
            },
            {
              variable: 'humidity',
              value: 60.2,
              timestamp: new Date()
            },
            {
              variable: 'pressure',
              value: 1013.25,
              timestamp: new Date()
            }
          ]
        }
      }
    }
  })

  const thing2 = await prisma.thing.create({
    data: {
      name: 'Sensor B',
      config: {
        create: {
          threshold: 25.0,
          samplingRate: 10,
          mode: 'manual'
        }
      },
      telemetry: {
        createMany: {
          data: [
            {
              variable: 'temperature',
              value: 20.0,
              timestamp: new Date()
            },
            {
              variable: 'humidity',
              value: 55.0,
              timestamp: new Date()
            },
            {
              variable: 'pressure',
              value: 1010.0,
              timestamp: new Date()
            }
          ]
        }
      }
    }
  })

  const thing3 = await prisma.thing.create({
    data: {
      name: 'Sensor C',
      config: {
        create: {
          threshold: 40.0,
          samplingRate: 15,
          mode: 'auto'
        }
      },
      telemetry: {
        createMany: {
          data: [
            {
              variable: 'temperature',
              value: 25.0,
              timestamp: new Date()
            },
            {
              variable: 'humidity',
              value: 65.0,
              timestamp: new Date()
            },
            {
              variable: 'pressure',
              value: 1020.0,
              timestamp: new Date()
            }
          ]
        }
      }
    }
  })

  console.log('🌱 Seeded Things:', thing1, thing2, thing3)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
