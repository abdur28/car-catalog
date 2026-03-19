import { prisma } from "@/lib/prisma";
import { CarCard } from "@/components/car-card";
import { CarFilters } from "@/components/car-filters";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CarsPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 20;
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const where: Record<string, unknown> = {};

  if (params.brand) where.brand = params.brand;
  if (params.bodyType) where.bodyType = params.bodyType;
  if (params.fuelType) where.fuelType = params.fuelType;
  if (params.transmission)
    where.transmission = { contains: params.transmission, mode: "insensitive" };

  if (params.yearFrom || params.yearTo) {
    where.year = {
      ...(params.yearFrom ? { gte: parseInt(params.yearFrom) } : {}),
      ...(params.yearTo ? { lte: parseInt(params.yearTo) } : {}),
    };
  }
  if (params.priceFrom || params.priceTo) {
    where.price = {
      ...(params.priceFrom ? { gte: parseInt(params.priceFrom) } : {}),
      ...(params.priceTo ? { lte: parseInt(params.priceTo) } : {}),
    };
  }
  if (params.search) {
    where.OR = [
      { brand: { contains: params.search, mode: "insensitive" } },
      { model: { contains: params.search, mode: "insensitive" } },
      { brandJp: { contains: params.search, mode: "insensitive" } },
      { modelJp: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.car.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header row */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
            Catalog
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide">
            {total} vehicle{total !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="lg:hidden">
          <Suspense>
            <CarFilters />
          </Suspense>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Desktop filters sidebar */}
        <Suspense>
          <div className="hidden lg:block">
            <CarFilters />
          </div>
        </Suspense>

        {/* Car grid */}
        <div className="flex-1 min-w-0">
          {cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-display text-2xl text-muted-foreground/80">
                No vehicles found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car, i) => (
                  <CarCard key={car.id} car={car} priority={i === 0} />
                ))}
              </div>
              <Suspense>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
