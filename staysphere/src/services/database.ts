import { Property, Booking, Review, User, SearchFilters, PaginatedResponse } from '../../shared/types';

// Storage keys
const STORAGE_KEYS = {
  PROPERTIES: 'staysphere_properties',
  BOOKINGS: 'staysphere_bookings',
  REVIEWS: 'staysphere_reviews',
  USERS: 'staysphere_users',
};

// Mock data generator
const generateMockProperties = (): Property[] => {
  return [
    {
      id: '1',
      title: 'Modern Loft in Downtown',
      description: 'A beautiful modern loft in the heart of downtown. Perfect for business travelers and tourists alike. Features floor-to-ceiling windows, modern amenities, and stunning city views.',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
        country: 'United States',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      price: 180,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'Dryer', 'City view'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      hostId: '1',
      ratings: { average: 4.9, count: 127 },
      availability: [],
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: '2',
      title: 'Cozy Beach House',
      description: 'Wake up to ocean views in this charming beach house. Just steps from the sand, this retreat offers the perfect blend of relaxation and adventure.',
      location: {
        address: '456 Ocean Drive',
        city: 'Malibu',
        country: 'United States',
        coordinates: { lat: 34.0259, lng: -118.7798 }
      },
      price: 320,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Beach access', 'Parking', 'Ocean view', 'BBQ grill'],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
      ],
      hostId: '2',
      ratings: { average: 4.8, count: 89 },
      availability: [],
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
    },
    {
      id: '3',
      title: 'Mountain Cabin Retreat',
      description: 'Escape to the mountains in this rustic yet comfortable cabin. Perfect for hiking enthusiasts and those seeking a peaceful getaway.',
      location: {
        address: '789 Mountain View Trail',
        city: 'Aspen',
        country: 'United States',
        coordinates: { lat: 39.1911, lng: -106.8175 }
      },
      price: 240,
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Hot tub', 'Mountain view', 'Hiking trails'],
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      hostId: '3',
      ratings: { average: 4.7, count: 203 },
      availability: [],
      createdAt: new Date('2024-01-25').toISOString(),
      updatedAt: new Date('2024-01-25').toISOString(),
    },
    {
      id: '4',
      title: 'Urban Studio',
      description: 'A sleek studio apartment in the bustling heart of NYC. Perfect for solo travelers or couples wanting to experience city life.',
      location: {
        address: '321 Broadway',
        city: 'New York',
        country: 'United States',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      price: 150,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Gym access', 'Rooftop terrace'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
      ],
      hostId: '4',
      ratings: { average: 4.6, count: 156 },
      availability: [],
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
    {
      id: '5',
      title: 'Historic Townhouse',
      description: 'Step back in time in this beautifully restored Victorian townhouse. Combines historic charm with modern amenities.',
      location: {
        address: '987 Heritage Lane',
        city: 'Boston',
        country: 'United States',
        coordinates: { lat: 42.3601, lng: -71.0589 }
      },
      price: 275,
      maxGuests: 5,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Garden', 'Historic district', 'Walking tours'],
      images: [
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'
      ],
      hostId: '5',
      ratings: { average: 4.5, count: 94 },
      availability: [],
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date('2024-02-05').toISOString(),
    },
    {
      id: '6',
      title: 'Desert Oasis Villa',
      description: 'Luxury villa with pool overlooking the stunning desert landscape. Perfect for groups seeking relaxation and adventure.',
      location: {
        address: '555 Desert Vista Drive',
        city: 'Scottsdale',
        country: 'United States',
        coordinates: { lat: 33.4942, lng: -111.9261 }
      },
      price: 450,
      maxGuests: 10,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ['WiFi', 'Kitchen', 'Pool', 'Hot tub', 'Desert view', 'Golf course', 'Spa'],
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566908829077-2d7ef183369e?w=800&h=600&fit=crop'
      ],
      hostId: '6',
      ratings: { average: 4.9, count: 72 },
      availability: [],
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-10').toISOString(),
    }
  ];
};

// Generate mock reviews
const generateMockReviews = (): Review[] => {
  return [
    {
      id: '1',
      propertyId: '1',
      guestId: 'demo-user-1',
      rating: 5,
      comment: 'Amazing stay! The loft is exactly as pictured with stunning city views. The location is perfect for exploring downtown, and the host was very responsive. Would definitely book again!',
      createdAt: new Date('2024-07-15').toISOString(),
      guest: {
        id: 'demo-user-1',
        email: 'sarah.j@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    },
    {
      id: '2',
      propertyId: '1',
      guestId: 'demo-user-2',
      rating: 5,
      comment: 'Incredible place with amazing views of the city. The apartment is modern, clean, and has everything you need. Great communication from the host. Highly recommended!',
      createdAt: new Date('2024-06-28').toISOString(),
      guest: {
        id: 'demo-user-2',
        email: 'mike.c@example.com',
        firstName: 'Mike',
        lastName: 'Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    },
    {
      id: '3',
      propertyId: '1',
      guestId: 'demo-user-3',
      rating: 4,
      comment: 'Great location and beautiful space. Only minor issue was some noise from the street at night, but overall a fantastic experience.',
      createdAt: new Date('2024-05-20').toISOString(),
      guest: {
        id: 'demo-user-3',
        email: 'emily.r@example.com',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    },
    {
      id: '4',
      propertyId: '2',
      guestId: 'demo-user-4',
      rating: 5,
      comment: 'Waking up to ocean views every morning was pure magic! The beach house exceeded all expectations. Perfect for a romantic getaway.',
      createdAt: new Date('2024-07-10').toISOString(),
      guest: {
        id: 'demo-user-4',
        email: 'alex.t@example.com',
        firstName: 'Alex',
        lastName: 'Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    },
    {
      id: '5',
      propertyId: '2',
      guestId: 'demo-user-5',
      rating: 5,
      comment: 'Absolutely stunning property! Just steps from the beach, beautifully decorated, and the host provided great local recommendations. A perfect 5 stars!',
      createdAt: new Date('2024-06-15').toISOString(),
      guest: {
        id: 'demo-user-5',
        email: 'lisa.w@example.com',
        firstName: 'Lisa',
        lastName: 'Williams',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    },
    {
      id: '6',
      propertyId: '3',
      guestId: 'demo-user-6',
      rating: 5,
      comment: 'The perfect mountain retreat! Cozy cabin with everything needed for a relaxing getaway. The fireplace and mountain views made it unforgettable.',
      createdAt: new Date('2024-04-22').toISOString(),
      guest: {
        id: 'demo-user-6',
        email: 'david.k@example.com',
        firstName: 'David',
        lastName: 'Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isHost: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      }
    }
  ];
};

// Generate mock bookings
const generateMockBookings = (): Booking[] => {
  return [
    {
      id: 'booking-1',
      propertyId: '1',
      guestId: 'demo-user-1',
      checkIn: new Date('2024-07-10').toISOString(),
      checkOut: new Date('2024-07-15').toISOString(),
      guests: 2,
      totalPrice: 900,
      status: 'completed',
      createdAt: new Date('2024-07-01').toISOString(),
      updatedAt: new Date('2024-07-15').toISOString(),
    },
    {
      id: 'booking-2',
      propertyId: '1',
      guestId: 'demo-user-2',
      checkIn: new Date('2024-06-20').toISOString(),
      checkOut: new Date('2024-06-28').toISOString(),
      guests: 1,
      totalPrice: 1440,
      status: 'completed',
      createdAt: new Date('2024-06-10').toISOString(),
      updatedAt: new Date('2024-06-28').toISOString(),
    },
    {
      id: 'booking-3',
      propertyId: '2',
      guestId: 'demo-user-4',
      checkIn: new Date('2024-07-05').toISOString(),
      checkOut: new Date('2024-07-10').toISOString(),
      guests: 2,
      totalPrice: 1600,
      status: 'completed',
      createdAt: new Date('2024-06-25').toISOString(),
      updatedAt: new Date('2024-07-10').toISOString(),
    },
    {
      id: 'booking-4',
      propertyId: '3',
      guestId: 'demo-user-6',
      checkIn: new Date('2024-04-15').toISOString(),
      checkOut: new Date('2024-04-22').toISOString(),
      guests: 4,
      totalPrice: 1680,
      status: 'completed',
      createdAt: new Date('2024-04-01').toISOString(),
      updatedAt: new Date('2024-04-22').toISOString(),
    }
  ];
};

// Database service class
export class DatabaseService {
  // Initialize with mock data if no data exists
  static initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(generateMockProperties()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(generateMockBookings()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(generateMockReviews()));
    }
  }

  // Property operations
  static getProperties(filters?: SearchFilters, page = 1, limit = 12): PaginatedResponse<Property> {
    this.initialize();
    
    let properties: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    
    // Apply filters
    if (filters) {
      properties = properties.filter(property => {
        let matches = true;
        
        if (filters.location) {
          const searchLocation = filters.location.toLowerCase();
          matches = matches && (
            property.location.city.toLowerCase().includes(searchLocation) ||
            property.location.country.toLowerCase().includes(searchLocation) ||
            property.location.address.toLowerCase().includes(searchLocation)
          );
        }
        
        if (filters.guests) {
          matches = matches && property.maxGuests >= filters.guests;
        }
        
        if (filters.minPrice) {
          matches = matches && property.price >= filters.minPrice;
        }
        
        if (filters.maxPrice) {
          matches = matches && property.price <= filters.maxPrice;
        }
        
        if (filters.amenities && filters.amenities.length > 0) {
          matches = matches && filters.amenities.some(amenity => 
            property.amenities.includes(amenity)
          );
        }
        
        return matches;
      });
    }
    
    // Pagination
    const total = properties.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = properties.slice(startIndex, endIndex);
    
    return {
      data: paginatedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static getPropertyById(id: string): Property | null {
    this.initialize();
    const properties: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    return properties.find(p => p.id === id) || null;
  }

  static createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    this.initialize();
    const properties: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    
    const newProperty: Property = {
      ...property,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    properties.push(newProperty);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    
    return newProperty;
  }

  static updateProperty(id: string, updates: Partial<Property>): Property | null {
    this.initialize();
    const properties: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    properties[index] = {
      ...properties[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return properties[index];
  }

  static deleteProperty(id: string): boolean {
    this.initialize();
    const properties: Property[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
    
    const filteredProperties = properties.filter(p => p.id !== id);
    if (filteredProperties.length === properties.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filteredProperties));
    return true;
  }

  // Booking operations
  static getBookings(userId?: string): Booking[] {
    this.initialize();
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    
    if (userId) {
      return bookings.filter(booking => booking.guestId === userId);
    }
    
    return bookings;
  }

  static getBookingById(id: string): Booking | null {
    this.initialize();
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return bookings.find(b => b.id === id) || null;
  }

  static createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    this.initialize();
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    
    return newBooking;
  }

  static updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    this.initialize();
    const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    bookings[index] = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  }

  // Review operations
  static getReviewsForProperty(propertyId: string): Review[] {
    this.initialize();
    const reviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    return reviews.filter(review => review.propertyId === propertyId);
  }

  static createReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    this.initialize();
    const reviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    
    return newReview;
  }

  // Utility methods
  static clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static resetToMockData() {
    this.clearAllData();
    this.initialize();
  }
  
  static forceResetReviews() {
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(generateMockReviews()));
  }
}

// Initialize on import
// Check if reviews data exists, if not force initialize
if (!localStorage.getItem('staysphere_reviews') || JSON.parse(localStorage.getItem('staysphere_reviews') || '[]').length === 0) {
  localStorage.setItem('staysphere_reviews', JSON.stringify(generateMockReviews()));
}
DatabaseService.initialize();