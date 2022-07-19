-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(10) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");
