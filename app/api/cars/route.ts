import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  brand: z.string().optional(),
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
  priceFrom: z.coerce.number().int().optional(),
  priceTo: z.coerce.number().int().optional(),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["price", "year", "mileage", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(params);

    const where: Record<string, unknown> = {};

    if (query.brand) where.brand = query.brand;
    if (query.bodyType) where.bodyType = query.bodyType;
    if (query.transmission) where.transmission = { contains: query.transmission, mode: "insensitive" };
    if (query.fuelType) where.fuelType = query.fuelType;

    if (query.yearFrom || query.yearTo) {
      where.year = {
        ...(query.yearFrom ? { gte: query.yearFrom } : {}),
        ...(query.yearTo ? { lte: query.yearTo } : {}),
      };
    }

    if (query.priceFrom || query.priceTo) {
      where.price = {
        ...(query.priceFrom ? { gte: query.priceFrom } : {}),
        ...(query.priceTo ? { lte: query.priceTo } : {}),
      };
    }

    if (query.search) {
      where.OR = [
        { brand: { contains: query.search, mode: "insensitive" } },
        { model: { contains: query.search, mode: "insensitive" } },
        { brandJp: { contains: query.search, mode: "insensitive" } },
        { modelJp: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({
      cars,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
