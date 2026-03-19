import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gauge, Fuel, MapPin, Cog } from "lucide-react";

interface CarCardProps {
  car: {
    id: string;
    brand: string;
    model: string;
    year: number | null;
    mileage: number | null;
    price: number | null;
    transmission: string | null;
    fuelType: string | null;
    bodyType: string | null;
    location: string | null;
    images: string[];
  };
  priority?: boolean;
}

function formatPrice(price: number | null) {
  if (!price) return "Price on request";
  return `¥${price.toLocaleString()}`;
}

function formatMileage(km: number | null) {
  if (!km) return "N/A";
  if (km >= 10000) return `${(km / 10000).toFixed(1)}万 km`;
  return `${km.toLocaleString()} km`;
}

export function CarCard({ car, priority }: CarCardProps) {
  const imgSrc = car.images[0] || null;

  return (
    <Link href={`/cars/${car.id}`} className="group">
      <Card className="p-0 overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 h-full">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {/* Warm gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          {car.bodyType && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 text-[10px] tracking-wider uppercase bg-background/80 backdrop-blur-sm border-none"
            >
              {car.bodyType}
            </Badge>
          )}
          {/* Price overlay on image */}
          <div className="absolute bottom-3 right-3">
            <span className="text-white font-bold text-lg drop-shadow-md">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-display text-lg leading-tight line-clamp-1">
              {car.brand} {car.model}
            </h3>
            {car.year && (
              <span className="text-xs text-muted-foreground tracking-wide">
                {car.year}
              </span>
            )}
          </div>
          <div className="h-px bg-border/60" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 shrink-0 text-accent/70" />
              {formatMileage(car.mileage)}
            </span>
            {car.fuelType && (
              <span className="flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                {car.fuelType}
              </span>
            )}
            {car.transmission && (
              <span className="flex items-center gap-1.5">
                <Cog className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                {car.transmission}
              </span>
            )}
            {car.location && (
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                {car.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
