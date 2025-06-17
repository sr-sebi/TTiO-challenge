import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedThings = [
  {
    name: 'Sensor A',
    config: [
      { key: 'threshold', value: '30.5' },
      { key: 'samplingRate', value: '5' },
      { key: 'mode', value: 'auto' },
    ],
    telemetry: [
      { variable: 'temperature', value: 22.5 },
      { variable: 'temperature', value: 23.0 },
      { variable: 'temperature', value: 21.8 },
      { variable: 'humidity', value: 50.0 },
      { variable: 'humidity', value: 55.5 },
      { variable: 'humidity', value: 60.2 },
      { variable: 'pressure', value: 1013.25 },
      { variable: 'pressure', value: 1012.0 },
      { variable: 'light', value: 300.0 },
    ],
  },
  {
    name: 'Sensor B',
    config: [
      { key: 'threshold', value: '25.0' },
      { key: 'samplingRate', value: '10' },
      { key: 'mode', value: 'manual' },
    ],
    telemetry: [
      { variable: 'temperature', value: 20.0 },
      { variable: 'temperature', value: 21.5 },
      { variable: 'temperature', value: 19.5 },
      { variable: 'humidity', value: 45.0 },
      { variable: 'humidity', value: 50.0 },
      { variable: 'humidity', value: 52.5 },
      { variable: 'humidity', value: 55.0 },
      { variable: 'pressure', value: 1010.0 },
      { variable: 'pressure', value: 1008.0 },
      { variable: 'pressure', value: 1009.5 },
    ],
  },
  {
    name: 'Sensor C',
    config: [
      { key: 'threshold', value: '40.0' },
      { key: 'samplingRate', value: '15' },
      { key: 'mode', value: 'auto' },
    ],
    telemetry: [
      { variable: 'temperature', value: 25.0 },
      { variable: 'humidity', value: 65.0 },
      { variable: 'pressure', value: 1020.0 },
      { variable: 'light', value: 400.0 },
      { variable: 'temperature', value: 26.5 },
      { variable: 'humidity', value: 70.0 },
      { variable: 'pressure', value: 1018.5 },
      { variable: 'light', value: 420.0 },
      { variable: 'temperature', value: 24.0 },
      { variable: 'humidity', value: 68.0 },
      { variable: 'pressure', value: 1019.0 },
      { variable: 'light', value: 410.0 },
    ],
  },
]

async function main() {
  const createdThings = []

  for (const thing of seedThings) {
    const createdConfig = await prisma.thingConfig.create({
      data: {
        parameters: {
          createMany: {
            data: thing.config,
          },
        },
      },
    })

    const createdThing = await prisma.thing.create({
      data: {
        name: thing.name,
        configId: createdConfig.id,
        telemetry: {
          createMany: {
            data: thing.telemetry.map(entry => ({
              ...entry,
              timestamp: new Date(),
            })),
          },
        },
      },
    })

    const telemetryVariables = thing.telemetry.map(entry => entry.variable)
    const uniqueVariables = Array.from(new Set(telemetryVariables))
    
    await prisma.telemetryVariable.createMany({
      data: uniqueVariables.map(variable => ({
        name: variable,
        configId: createdConfig.id,
      })),
    })

    createdThings.push(createdThing)
  }

  console.log('🌱 Seeded Things:', createdThings.map(t => t.name).join(', '))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
