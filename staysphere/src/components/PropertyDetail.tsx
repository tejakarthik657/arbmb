import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  Star, 
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  Home,
  Calendar,
  Loader2
} from "lucide-react";
import { Property, Review } from '../../shared/types';
import { API } from '../services/api';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { ReviewList } from './ReviewList';

interface PropertyDetailProps {
  propertyId: string;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId }) => {
  const { goBack, navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch property and reviews
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [propertyResponse, reviewsResponse] = await Promise.all([
          API.properties.getPropertyById(propertyId),
          API.reviews.getPropertyReviews(propertyId)
        ]);
        
        if (propertyResponse.success && propertyResponse.data) {
          setProperty(propertyResponse.data);
        } else {
          setError(propertyResponse.error || 'Property not found');
        }
        
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [propertyId]);

  // Calculate total price when dates change
  useEffect(() => {
    if (checkIn && checkOut && property) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      
      if (nights > 0) {
        setTotalNights(nights);
        setTotalPrice(nights * property.price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, property]);

  const handleReviewAdded = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      // TODO: Open auth modal
      return;
    }
    
    if (!property || !user || !checkIn || !checkOut) {
      setBookingError('Please fill in all booking details');
      return;
    }
    
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      const response = await API.bookings.createBooking({
        propertyId: property.id,
        guestId: user.id,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalPrice,
        status: 'confirmed'
      });
      
      if (response.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate({ name: 'bookings' });
        }, 2000);
      } else {
        setBookingError(response.error || 'Booking failed');
      }
    } catch (err) {
      setBookingError('An error occurred during booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Kitchen': <Coffee className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
      'Pool': <Waves className="h-4 w-4" />,
      'Mountain view': <Mountain className="h-4 w-4" />,
      'Ocean view': <Waves className="h-4 w-4" />,
      'Beach access': <Waves className="h-4 w-4" />,
    };
    
    return iconMap[amenity] || <Home className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Property title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="font-medium">{property.ratings.average}</span>
              <span>({property.ratings.count} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.location.city}, {property.location.country}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            <div className="space-y-4">
              <img 
                src={property.images[selectedImageIndex]} 
                alt={property.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className={`h-20 object-cover rounded cursor-pointer transition-opacity ${
                      selectedImageIndex === index ? 'opacity-100 ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Property details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {property.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} bathrooms</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About this place</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews section */}
            <ReviewList 
              reviews={reviews}
              propertyId={propertyId}
              onReviewAdded={handleReviewAdded}
            />
          </div>

          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold">${property.price}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Check in</label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Check out</label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max={property.maxGuests}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                  
                  {totalNights > 0 && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span>${property.price} × {totalNights} nights</span>
                        <span>${property.price * totalNights}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  )}
                  
                  {bookingError && (
                    <Alert variant="destructive">
                      <AlertDescription>{bookingError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {bookingSuccess && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <AlertDescription>
                        Booking confirmed! Redirecting to your bookings...
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBooking}
                    disabled={bookingLoading || !checkIn || !checkOut || bookingSuccess}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : bookingSuccess ? (
                      'Booking Confirmed!'
                    ) : isAuthenticated ? (
                      'Reserve'
                    ) : (
                      'Log in to book'
                    )}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      You'll need to log in to complete your booking
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};