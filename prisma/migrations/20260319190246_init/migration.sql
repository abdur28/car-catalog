-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "brand_jp" TEXT,
    "model" TEXT NOT NULL,
    "model_jp" TEXT,
    "year" INTEGER,
    "mileage" INTEGER,
    "mileage_unit" TEXT DEFAULT 'km',
    "price" INTEGER,
    "price_currency" TEXT DEFAULT 'JPY',
    "engine_size" TEXT,
    "transmission" TEXT,
    "fuel_type" TEXT,
    "color" TEXT,
    "body_type" TEXT,
    "location" TEXT,
    "description" TEXT,
    "url" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "cars_external_id_key" ON "cars"("external_id");

-- CreateIndex
CREATE INDEX "cars_brand_idx" ON "cars"("brand");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "cars"("year");

-- CreateIndex
CREATE INDEX "cars_price_idx" ON "cars"("price");
