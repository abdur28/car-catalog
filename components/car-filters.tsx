"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FiltersData {
  brands: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  yearRange: { min: number | null; max: number | null };
  priceRange: { min: number | null; max: number | null };
}

export function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersData | null>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    fetch("/api/cars/filters")
      .then((r) => r.json())
      .then(setFilters)
      .catch(() => {});
  }, []);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search — waits 500ms after user stops typing
  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("search", value);
    }, 500);
  }

  function clearFilters() {
    setSearchValue("");
    router.push("/cars");
  }

  const hasFilters =
    searchParams.has("brand") ||
    searchParams.has("bodyType") ||
    searchParams.has("fuelType") ||
    searchParams.has("transmission") ||
    searchParams.has("yearFrom") ||
    searchParams.has("yearTo") ||
    searchParams.has("priceFrom") ||
    searchParams.has("priceTo") ||
    searchParams.has("search") ||
    searchParams.has("sortBy");

  const filterContent = (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-1.5">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Brand or model..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-1.5">
        <Label>Brand</Label>
        <Select
          value={searchParams.get("brand") || "all"}
          onValueChange={(v) => updateParams("brand", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {filters?.brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div className="space-y-1.5">
        <Label>Body Type</Label>
        <Select
          value={searchParams.get("bodyType") || "all"}
          onValueChange={(v) => updateParams("bodyType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {filters?.bodyTypes.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-1.5">
        <Label>Fuel Type</Label>
        <Select
          value={searchParams.get("fuelType") || "all"}
          onValueChange={(v) => updateParams("fuelType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All fuel types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fuel types</SelectItem>
            {filters?.fuelTypes.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-1.5">
        <Label>Transmission</Label>
        <Select
          value={searchParams.get("transmission") || "all"}
          onValueChange={(v) => updateParams("transmission", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {filters?.transmissions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Range */}
      <div className="space-y-1.5">
        <Label>Year</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            defaultValue={searchParams.get("yearFrom") || ""}
            onBlur={(e) => updateParams("yearFrom", e.target.value)}
          />
          <Input
            type="number"
            placeholder="To"
            defaultValue={searchParams.get("yearTo") || ""}
            onBlur={(e) => updateParams("yearTo", e.target.value)}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-1.5">
        <Label>Price (JPY)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("priceFrom") || ""}
            onBlur={(e) => updateParams("priceFrom", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("priceTo") || ""}
            onBlur={(e) => updateParams("priceTo", e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label>Sort by</Label>
        <Select
          value={searchParams.get("sortBy") || "createdAt"}
          onValueChange={(v) => updateParams("sortBy", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="mileage">Mileage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="space-y-1.5">
        <Label>Order</Label>
        <Select
          value={searchParams.get("sortOrder") || "desc"}
          onValueChange={(v) => updateParams("sortOrder", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-0.5 rounded-full bg-accent" />
          <h2 className="font-display text-xl">Filters</h2>
        </div>
        {filterContent}
      </aside>

      {/* Mobile sheet trigger */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="border-accent/30 hover:border-accent/60">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filters
              {hasFilters && (
                <span className="ml-1 h-2 w-2 rounded-full bg-accent" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-5 overflow-y-auto" aria-describedby={undefined}>
            <SheetHeader>
              <SheetTitle className="font-display text-xl">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
