import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  X,
  Eye,
  MessageCircle,
  Loader2
} from "lucide-react";
import { Booking } from '../../shared/types';
import { API } from '../services/api';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';

export const BookingsDashboard: React.FC = () => {
  const { goBack, navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await API.bookings.getUserBookings(user.id);
        
        if (response.success && response.data) {
          // Sort bookings by creation date (newest first)
          const sortedBookings = response.data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setBookings(sortedBookings);
        } else {
          setError(response.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    
    try {
      const response = await API.bookings.cancelBooking(bookingId);
      
      if (response.success) {
        // Update local state
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
      } else {
        setError(response.error || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('An error occurred while cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getBookingStatus = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (booking.status === 'cancelled') {
      return { label: 'Cancelled', variant: 'destructive' as const };
    }
    
    if (now > checkOut) {
      return { label: 'Completed', variant: 'default' as const };
    }
    
    if (now >= checkIn && now <= checkOut) {
      return { label: 'In Progress', variant: 'default' as const };
    }
    
    return { label: 'Upcoming', variant: 'secondary' as const };
  };

  const canCancelBooking = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    
    return booking.status === 'confirmed' && checkIn > now;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const upcomingBookings = bookings.filter(booking => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    return booking.status !== 'cancelled' && checkIn > now;
  });

  const pastBookings = bookings.filter(booking => {
    const now = new Date();
    const checkOut = new Date(booking.checkOut);
    return booking.status === 'cancelled' || checkOut <= now;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your bookings</p>
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Your trips</h1>
                <p className="text-muted-foreground">Manage your bookings and travel history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-32 rounded" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">
              When you book your first stay, it will appear here
            </p>
            <Button onClick={() => navigate({ name: 'properties' })}>
              Start exploring
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6 mt-6">
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
                    <p className="text-muted-foreground mb-4">Plan your next adventure</p>
                    <Button onClick={() => navigate({ name: 'properties' })}>
                      Find a stay
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                    onViewProperty={(id) => navigate({ name: 'property', id })}
                    cancellingId={cancellingId}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6 mt-6">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No past trips</h3>
                    <p className="text-muted-foreground">Your travel history will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewProperty={(id) => navigate({ name: 'property', id })}
                    isPast={true}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Booking card component
interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onViewProperty: (id: string) => void;
  cancellingId?: string | null;
  isPast?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onCancel, 
  onViewProperty, 
  cancellingId,
  isPast = false 
}) => {
  const status = getBookingStatus(booking);
  const canCancel = canCancelBooking(booking) && onCancel;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Property image */}
          <div className="md:w-48 h-48 md:h-auto relative">
            <img
              src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'}
              alt={booking.property?.title || 'Property'}
              className="w-full h-full object-cover"
            />
            <Badge 
              variant={status.variant}
              className="absolute top-2 left-2"
            >
              {status.label}
            </Badge>
          </div>
          
          {/* Booking details */}
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold truncate">
                    {booking.property?.title || 'Property'}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {booking.property?.location.city}, {booking.property?.location.country}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold">
                    Total: ${booking.totalPrice}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2 md:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProperty(booking.propertyId)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View property
                </Button>
                
                {!isPast && booking.property?.ratings && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{booking.property.ratings.average}</span>
                  </div>
                )}
                
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        Cancel booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onCancel(booking.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Cancel booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {isPast && booking.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Write review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions (moved outside component to avoid re-declaration)
function getBookingStatus(booking: Booking) {
  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  
  if (booking.status === 'cancelled') {
    return { label: 'Cancelled', variant: 'destructive' as const };
  }
  
  if (now > checkOut) {
    return { label: 'Completed', variant: 'default' as const };
  }
  
  if (now >= checkIn && now <= checkOut) {
    return { label: 'In Progress', variant: 'default' as const };
  }
  
  return { label: 'Upcoming', variant: 'secondary' as const };
}

function canCancelBooking(booking: Booking) {
  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  
  return booking.status === 'confirmed' && checkIn > now;
}