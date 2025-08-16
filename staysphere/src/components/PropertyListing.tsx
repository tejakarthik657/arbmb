import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  MapPin,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { Property, SearchFilters, PaginatedResponse } from '../../shared/types';
import { API } from '../services/api';
import { useRouter } from '../contexts/RouterContext';
import { useDebounce } from '../hooks/useDebounce';

interface PropertyListingProps {
  initialFilters?: SearchFilters;
}

export const PropertyListing: React.FC<PropertyListingProps> = ({ initialFilters }) => {
  const { navigate, goBack } = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [searchLocation, setSearchLocation] = useState(filters.location || '');
  const [guestCount, setGuestCount] = useState(filters.guests?.toString() || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('rating');
  
  // Debounce search inputs for better UX
  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  // Fetch properties
  const fetchProperties = async (currentFilters: SearchFilters, currentPage: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.properties.searchProperties(currentFilters, currentPage, 12);
      
      if (response.success && response.data) {
        let sortedProperties = [...response.data.data];
        
        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            sortedProperties.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            sortedProperties.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            sortedProperties.sort((a, b) => b.ratings.average - a.ratings.average);
            break;
        }
        
        setProperties(sortedProperties);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('An error occurred while fetching properties');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchProperties(filters, page);
  }, [filters, page, sortBy]);
  
  // Auto-search when debounced inputs change
  useEffect(() => {
    if (debouncedLocation !== searchLocation || 
        debouncedMinPrice !== minPrice || 
        debouncedMaxPrice !== maxPrice) return;
        
    const newFilters: SearchFilters = {
      ...filters,
      location: debouncedLocation || undefined,
      minPrice: debouncedMinPrice ? parseFloat(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : undefined,
    };
    
    // Only update if something actually changed
    const hasChanges = JSON.stringify(newFilters) !== JSON.stringify(filters);
    if (hasChanges) {
      setFilters(newFilters);
      setPage(1);
    }
  }, [debouncedLocation, debouncedMinPrice, debouncedMaxPrice]);

  const handleSearch = () => {
    const newFilters: SearchFilters = {
      ...filters,
      location: searchLocation || undefined,
      guests: guestCount ? parseInt(guestCount) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    
    setFilters(newFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchLocation('');
    setGuestCount('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate({ name: 'property', id: propertyId });
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 p-4">
          <div className="container mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Find your perfect stay</h1>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card 
                key={i} 
                className="animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="relative">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/90 backdrop-blur-lg sticky top-0 z-40 shadow-sm shadow-black/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {total > 0 ? `${total} stays` : 'Find your perfect stay'}
                </h1>
                {filters.location && (
                  <p className="text-muted-foreground">in {filters.location}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filter sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter properties</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect stay
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        placeholder="Where are you going?"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guests</label>
                      <Select value={guestCount} onValueChange={setGuestCount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'guest' : 'guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Price per night</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Min price</label>
                          <Input
                            type="number"
                            placeholder="$0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Max price</label>
                          <Input
                            type="number"
                            placeholder="$1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSearch} className="flex-1">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 mb-8 text-center backdrop-blur-sm">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Something went wrong</h3>
            <p className="text-destructive/80 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => fetchProperties(filters, page)}
              className="hover:bg-destructive/5 hover:border-destructive/40 transition-colors"
            >
              Try again
            </Button>
          </div>
        )}

        {properties.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <>
            {/* Properties grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <Card 
                  key={property.id} 
                  className="group cursor-pointer hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden border-border/50 hover:border-border hover:-translate-y-1 backdrop-blur-sm"
                  style={{ 
                    animationDelay: loading ? `${index * 100}ms` : '0ms'
                  }}
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 backdrop-blur-sm shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add to favorites
                      }}
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </Badge>
                      <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{property.ratings.average}</span>
                        <span className="text-xs text-muted-foreground">({property.ratings.count})</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h4>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location.city}, {property.location.country}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>Up to {property.maxGuests} guests</span>
                      </div>
                      
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              ${property.price}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">/ night</span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-primary font-medium">View details →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else {
                      if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 transition-all duration-200 hover:scale-110 ${
                          page === pageNum 
                            ? 'shadow-md bg-primary text-primary-foreground' 
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};