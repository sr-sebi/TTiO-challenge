-- CreateTable
CREATE TABLE "Thing" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryData" (
    "id" SERIAL NOT NULL,
    "variable" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "thingId" INTEGER NOT NULL,

    CONSTRAINT "TelemetryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThingConfig" (
    "id" SERIAL NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "samplingRate" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "thingId" INTEGER NOT NULL,

    CONSTRAINT "ThingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Thing_name_key" ON "Thing"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ThingConfig_thingId_key" ON "ThingConfig"("thingId");

-- AddForeignKey
ALTER TABLE "TelemetryData" ADD CONSTRAINT "TelemetryData_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "Thing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThingConfig" ADD CONSTRAINT "ThingConfig_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "Thing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
