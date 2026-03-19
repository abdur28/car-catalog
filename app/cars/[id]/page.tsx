import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  MapPin,
  ExternalLink,
  Cog,
  Car,
} from "lucide-react";
import { CarImageGallery } from "@/components/car-image-gallery";

interface Props {
  params: Promise<{ id: string }>;
}

function formatPrice(price: number | null) {
  if (!price) return "Price on request";
  return `¥${price.toLocaleString()}`;
}

function formatMileage(km: number | null) {
  if (!km) return "N/A";
  return `${km.toLocaleString()} km`;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });

  if (!car) notFound();

  const specs = [
    { icon: Calendar, label: "Year", value: car.year?.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Fuel", value: car.fuelType },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: Palette, label: "Color", value: car.color },
    { icon: Car, label: "Body Type", value: car.bodyType },
    { icon: MapPin, label: "Location", value: car.location },
    {
      icon: Cog,
      label: "Engine",
      value: car.engineSize,
    },
  ].filter((s) => s.value);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back navigation */}
      <Link href="/cars">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to catalog
        </Button>
      </Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: images */}
        <div>
          <CarImageGallery
            images={car.images}
            alt={`${car.brand} ${car.model}`}
          />
        </div>

        {/* Right: info panel */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {car.bodyType && (
              <Badge
                variant="secondary"
                className="text-[10px] tracking-wider uppercase"
              >
                {car.bodyType}
              </Badge>
            )}
            {car.fuelType && (
              <Badge
                variant="outline"
                className="text-[10px] tracking-wider uppercase"
              >
                {car.fuelType}
              </Badge>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl leading-tight">
              {car.brand} {car.model}
            </h1>
            {car.brandJp && car.modelJp && (
              <p className="text-sm text-muted-foreground mt-1">
                {car.brandJp} {car.modelJp}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-accent">
              {formatPrice(car.price)}
            </span>
          </div>

          <Separator className="bg-border/60" />

          {/* Specifications */}
          <div>
            <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Specifications
            </h2>
            <div className="space-y-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2.5 text-muted-foreground">
                    <Icon className="h-4 w-4 text-accent/60" />
                    {label}
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <>
              <Separator className="bg-border/60" />
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Description
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            </>
          )}

          {/* External link */}
          {car.url && (
            <>
              <Separator className="bg-border/60" />
              <a href={car.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full border-accent/30 hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on CarSensor
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
