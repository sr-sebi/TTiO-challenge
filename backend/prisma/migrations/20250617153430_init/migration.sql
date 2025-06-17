-- CreateTable
CREATE TABLE "Thing" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configId" INTEGER,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThingConfig" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ThingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigParameter" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "ConfigParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryVariable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "TelemetryVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryData" (
    "id" SERIAL NOT NULL,
    "variable" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thingId" INTEGER NOT NULL,

    CONSTRAINT "TelemetryData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Thing_name_key" ON "Thing"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Thing_configId_key" ON "Thing"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigParameter_configId_key_key" ON "ConfigParameter"("configId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "TelemetryVariable_configId_name_key" ON "TelemetryVariable"("configId", "name");

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ThingConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigParameter" ADD CONSTRAINT "ConfigParameter_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ThingConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryVariable" ADD CONSTRAINT "TelemetryVariable_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ThingConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryData" ADD CONSTRAINT "TelemetryData_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
