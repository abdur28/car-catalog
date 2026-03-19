import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [brands, bodyTypes, fuelTypes, transmissions, yearRange, priceRange] =
      await Promise.all([
        prisma.car.findMany({ select: { brand: true }, distinct: ["brand"], orderBy: { brand: "asc" } }),
        prisma.car.findMany({ select: { bodyType: true }, distinct: ["bodyType"], where: { bodyType: { not: null } } }),
        prisma.car.findMany({ select: { fuelType: true }, distinct: ["fuelType"], where: { fuelType: { not: null } } }),
        prisma.car.findMany({ select: { transmission: true }, distinct: ["transmission"], where: { transmission: { not: null } } }),
        prisma.car.aggregate({ _min: { year: true }, _max: { year: true } }),
        prisma.car.aggregate({ _min: { price: true }, _max: { price: true } }),
      ]);

    return NextResponse.json({
      brands: brands.map((b) => b.brand),
      bodyTypes: bodyTypes.map((b) => b.bodyType).filter(Boolean),
      fuelTypes: fuelTypes.map((f) => f.fuelType).filter(Boolean),
      transmissions: transmissions.map((t) => t.transmission).filter(Boolean),
      yearRange: { min: yearRange._min.year, max: yearRange._max.year },
      priceRange: { min: priceRange._min.price, max: priceRange._max.price },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
