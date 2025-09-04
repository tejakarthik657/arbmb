import { Property } from '../../../shared/types';

export const properties: Property[] = [
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
