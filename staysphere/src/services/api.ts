import { Property, Booking, Review, SearchFilters, ApiResponse, PaginatedResponse } from '../../shared/types';
import { DatabaseService } from './database';

// Simulate API delay for realistic experience
const simulateApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class PropertyAPI {
  static async searchProperties(
    filters?: SearchFilters, 
    page = 1, 
    limit = 12
  ): Promise<ApiResponse<PaginatedResponse<Property>>> {
    try {
      await simulateApiDelay();
      const result = DatabaseService.getProperties(filters, page, limit);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Failed to fetch properties' };
    }
  }

  static async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    try {
      await simulateApiDelay();
      const property = DatabaseService.getPropertyById(id);
      
      if (!property) {
        return { success: false, error: 'Property not found' };
      }
      
      return { success: true, data: property };
    } catch (error) {
      return { success: false, error: 'Failed to fetch property' };
    }
  }

  static async createProperty(
    propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Property>> {
    try {
      await simulateApiDelay(1000);
      const property = DatabaseService.createProperty(propertyData);
      return { success: true, data: property };
    } catch (error) {
      return { success: false, error: 'Failed to create property' };
    }
  }

  static async updateProperty(
    id: string, 
    updates: Partial<Property>
  ): Promise<ApiResponse<Property>> {
    try {
      await simulateApiDelay();
      const property = DatabaseService.updateProperty(id, updates);
      
      if (!property) {
        return { success: false, error: 'Property not found' };
      }
      
      return { success: true, data: property };
    } catch (error) {
      return { success: false, error: 'Failed to update property' };
    }
  }

  static async deleteProperty(id: string): Promise<ApiResponse<boolean>> {
    try {
      await simulateApiDelay();
      const deleted = DatabaseService.deleteProperty(id);
      
      if (!deleted) {
        return { success: false, error: 'Property not found' };
      }
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete property' };
    }
  }

  static async getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
    try {
      await simulateApiDelay(300);
      const result = DatabaseService.getProperties(undefined, 1, 6);
      // Sort by rating and return top properties
      const featured = result.data
        .sort((a, b) => b.ratings.average - a.ratings.average)
        .slice(0, 4);
      
      return { success: true, data: featured };
    } catch (error) {
      return { success: false, error: 'Failed to fetch featured properties' };
    }
  }
}

export class BookingAPI {
  static async getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
    try {
      await simulateApiDelay();
      const bookings = DatabaseService.getBookings(userId);
      
      // Add property details to bookings
      const bookingsWithProperties = await Promise.all(
        bookings.map(async (booking) => {
          const property = DatabaseService.getPropertyById(booking.propertyId);
          return { ...booking, property: property || undefined };
        })
      );
      
      return { success: true, data: bookingsWithProperties };
    } catch (error) {
      return { success: false, error: 'Failed to fetch bookings' };
    }
  }

  static async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Booking>> {
    try {
      await simulateApiDelay(1000);
      
      // Check if property exists
      const property = DatabaseService.getPropertyById(bookingData.propertyId);
      if (!property) {
        return { success: false, error: 'Property not found' };
      }
      
      // Check availability (simplified check)
      const existingBookings = DatabaseService.getBookings();
      const conflictingBooking = existingBookings.find(booking => 
        booking.propertyId === bookingData.propertyId &&
        booking.status !== 'cancelled' &&
        (
          (new Date(bookingData.checkIn) >= new Date(booking.checkIn) && 
           new Date(bookingData.checkIn) < new Date(booking.checkOut)) ||
          (new Date(bookingData.checkOut) > new Date(booking.checkIn) && 
           new Date(bookingData.checkOut) <= new Date(booking.checkOut))
        )
      );
      
      if (conflictingBooking) {
        return { success: false, error: 'Property is not available for the selected dates' };
      }
      
      const booking = DatabaseService.createBooking({
        ...bookingData,
        status: 'confirmed'
      });
      
      return { success: true, data: booking };
    } catch (error) {
      return { success: false, error: 'Failed to create booking' };
    }
  }

  static async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    try {
      await simulateApiDelay();
      const booking = DatabaseService.updateBooking(id, { status: 'cancelled' });
      
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }
      
      return { success: true, data: booking };
    } catch (error) {
      return { success: false, error: 'Failed to cancel booking' };
    }
  }
}

export class ReviewAPI {
  static async getPropertyReviews(propertyId: string): Promise<ApiResponse<Review[]>> {
    try {
      await simulateApiDelay();
      const reviews = DatabaseService.getReviewsForProperty(propertyId);
      
      // Reviews from mock data already include guest info,
      // but for new reviews, we'd need to populate guest details
      const reviewsWithGuests = reviews.map(review => {
        if (!review.guest) {
          // This would happen for dynamically created reviews
          // In a real app, this would be a database join
          return { ...review, guest: { 
            id: review.guestId, 
            firstName: 'Anonymous', 
            lastName: 'User' 
          } as any };
        }
        return review;
      });
      
      return { success: true, data: reviewsWithGuests };
    } catch (error) {
      return { success: false, error: 'Failed to fetch reviews' };
    }
  }

  static async createReview(
    reviewData: Omit<Review, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Review>> {
    try {
      await simulateApiDelay();
      
      // Check if property exists
      const property = DatabaseService.getPropertyById(reviewData.propertyId);
      if (!property) {
        return { success: false, error: 'Property not found' };
      }
      
      // Check if user has stayed at the property (simplified check)
      const userBookings = DatabaseService.getBookings(reviewData.guestId);
      const hasStayed = userBookings.some(booking => 
        booking.propertyId === reviewData.propertyId && 
        booking.status === 'completed'
      );
      
      // Allow demo user to post reviews for testing
      const isDemoUser = reviewData.guestId.startsWith('demo') || reviewData.guest?.email === 'demo@staysphere.com';
      
      if (!hasStayed && !isDemoUser) {
        return { success: false, error: 'You can only review properties you have stayed at' };
      }
      
      const review = DatabaseService.createReview(reviewData);
      // Add guest information to the response
      const reviewWithGuest = { ...review, guest: reviewData.guest };
      return { success: true, data: reviewWithGuest };
    } catch (error) {
      return { success: false, error: 'Failed to create review' };
    }
  }
}

// Utility API functions
export class UtilityAPI {
  static async uploadImage(file: File): Promise<ApiResponse<string>> {
    try {
      await simulateApiDelay(2000);
      
      // In a real app, this would upload to a cloud service
      // For now, we'll use a placeholder image service
      const imageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop&q=80`;
      
      return { success: true, data: imageUrl };
    } catch (error) {
      return { success: false, error: 'Failed to upload image' };
    }
  }

  static async geocodeAddress(address: string): Promise<ApiResponse<{ lat: number; lng: number }>> {
    try {
      await simulateApiDelay(500);
      
      // Mock geocoding - in a real app, use Google Maps Geocoding API
      const mockCoordinates = {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      };
      
      return { success: true, data: mockCoordinates };
    } catch (error) {
      return { success: false, error: 'Failed to geocode address' };
    }
  }
}

// Combined API object for easy importing
export const API = {
  properties: PropertyAPI,
  bookings: BookingAPI,
  reviews: ReviewAPI,
  utils: UtilityAPI,
};