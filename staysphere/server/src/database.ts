import { Property, Booking, Review, User, SearchFilters, PaginatedResponse } from '../../../shared/types';
import { properties as mockProperties } from './data/properties';
import { reviews as mockReviews } from './data/reviews';
import { bookings as mockBookings } from './data/bookings';
import { users as mockUsers } from './data/users';

let properties: Property[] = [...mockProperties];
let reviews: Review[] = [...mockReviews];
let bookings: Booking[] = [...mockBookings];
let users: User[] = [...mockUsers];

export class DatabaseService {
    // Property operations
    static getProperties(filters?: SearchFilters, page = 1, limit = 12): PaginatedResponse<Property> {
        let filteredProperties = [...properties];

        if (filters) {
            if (filters.location) {
                const searchLocation = filters.location.toLowerCase();
                filteredProperties = filteredProperties.filter(property =>
                    property.location.city.toLowerCase().includes(searchLocation) ||
                    property.location.country.toLowerCase().includes(searchLocation) ||
                    property.location.address.toLowerCase().includes(searchLocation)
                );
            }
            if (filters.guests) {
                filteredProperties = filteredProperties.filter(property => property.maxGuests >= filters.guests);
            }
            if (filters.minPrice) {
                filteredProperties = filteredProperties.filter(property => property.price >= filters.minPrice);
            }
            if (filters.maxPrice) {
                filteredProperties = filteredProperties.filter(property => property.price <= filters.maxPrice);
            }
            if (filters.amenities && filters.amenities.length > 0) {
                filteredProperties = filteredProperties.filter(property =>
                    filters.amenities.every(amenity => property.amenities.includes(amenity))
                );
            }
        }

        const total = filteredProperties.length;
        const startIndex = (page - 1) * limit;
        const paginatedProperties = filteredProperties.slice(startIndex, startIndex + limit);

        return {
            data: paginatedProperties,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    static getPropertyById(id: string): Property | null {
        return properties.find(p => p.id === id) || null;
    }

    static createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
        const newProperty: Property = {
            ...propertyData,
            id: String(properties.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        properties.push(newProperty);
        return newProperty;
    }

    static updateProperty(id: string, updates: Partial<Property>): Property | null {
        const index = properties.findIndex(p => p.id === id);
        if (index === -1) return null;

        properties[index] = { ...properties[index], ...updates, updatedAt: new Date().toISOString() };
        return properties[index];
    }

    static deleteProperty(id: string): boolean {
        const initialLength = properties.length;
        properties = properties.filter(p => p.id !== id);
        return properties.length < initialLength;
    }

    // Booking operations
    static getBookings(userId?: string): Booking[] {
        if (userId) {
            return bookings.filter(booking => booking.guestId === userId);
        }
        return bookings;
    }

    static createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
        const newBooking: Booking = {
            ...bookingData,
            id: `booking-${bookings.length + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        bookings.push(newBooking);
        return newBooking;
    }

    static cancelBooking(id: string): Booking | null {
        const index = bookings.findIndex(b => b.id === id);
        if (index === -1) return null;

        bookings[index].status = 'cancelled';
        bookings[index].updatedAt = new Date().toISOString();
        return bookings[index];
    }

    // Review operations
    static getReviewsForProperty(propertyId: string): Review[] {
        return reviews.filter(review => review.propertyId === propertyId);
    }

    static createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
        const newReview: Review = {
            ...reviewData,
            id: `review-${reviews.length + 1}`,
            createdAt: new Date().toISOString(),
        };
        reviews.push(newReview);
        return newReview;
    }

    // User operations
    static getUserByEmail(email: string): User | null {
        return users.find(u => u.email === email) || null;
    }

    static getUserById(id: string): User | null {
        return users.find(u => u.id === id) || null;
    }

    static createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
        const newUser: User = {
            ...userData,
            id: `user-${users.length + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        return newUser;
    }
}
