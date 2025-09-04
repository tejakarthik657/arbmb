import { Review } from '../../../shared/types';

export const reviews: Review[] = [
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
      id:. '4',
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
