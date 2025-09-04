import { Property, Booking, Review, SearchFilters, ApiResponse, PaginatedResponse, LoginCredentials, RegisterCredentials, AuthUser } from '../../shared/types';

const API_BASE_URL = 'http://localhost:3001/api';

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        const mergedOptions: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };
        const response = await fetch(`${API_BASE_URL}${url}`, mergedOptions);
        const data: ApiResponse<T> = await response.json();
        if (!response.ok) {
            return { success: false, error: data.error || 'An unknown error occurred' };
        }
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred';
        return { success: false, error: `Failed to connect to the server: ${errorMessage}` };
    }
}

export class AuthAPI {
    static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
        return fetchApi<AuthUser>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    static async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthUser>> {
        return fetchApi<AuthUser>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    static async getMe(): Promise<ApiResponse<AuthUser>> {
        // In a real app, the token would be sent in the Authorization header
        return fetchApi<AuthUser>('/auth/me');
    }
}

export class PropertyAPI {
  static async searchProperties(
    filters?: SearchFilters,
    page = 1,
    limit = 12
  ): Promise<ApiResponse<PaginatedResponse<Property>>> {
    const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, String(value));
            }
        });
    }
    return fetchApi<PaginatedResponse<Property>>(`/properties?${queryParams.toString()}`);
  }

  static async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    return fetchApi<Property>(`/properties/${id}`);
  }

  static async createProperty(
    propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Property>> {
    return fetchApi<Property>('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
    });
  }

  static async updateProperty(
    id: string,
    updates: Partial<Property>
  ): Promise<ApiResponse<Property>> {
    return fetchApi<Property>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
  }

  static async deleteProperty(id: string): Promise<ApiResponse<boolean>> {
    return fetchApi<boolean>(`/properties/${id}`, {
        method: 'DELETE',
    });
  }

  static async getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
    return fetchApi<Property[]>('/properties/featured');
  }
}

export class BookingAPI {
  static async getUserBookings(userId: string): Promise<ApiResponse<Booking[]>> {
    return fetchApi<Booking[]>(`/bookings/user/${userId}`);
  }

  static async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
  }

  static async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return fetchApi<Booking>(`/bookings/${id}/cancel`, {
        method: 'POST',
    });
  }
}

export class ReviewAPI {
  static async getPropertyReviews(propertyId: string): Promise<ApiResponse<Review[]>> {
    return fetchApi<Review[]>(`/reviews/property/${propertyId}`);
  }

  static async createReview(
    reviewData: Omit<Review, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Review>> {
    return fetchApi<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
  }
}

export class UtilityAPI {
  static async uploadImage(file: File): Promise<ApiResponse<string>> {
    // This will be a mock until a real file upload service is implemented
    console.log("Mock image upload for:", file.name);
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          success: true,
          data: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        });
      }, 1000)
    );
  }

  static async geocodeAddress(address: string): Promise<ApiResponse<{ lat: number; lng: number }>> {
    // This will be a mock until a real geocoding service is implemented
    console.log("Mock geocoding for:", address);
    return new Promise(resolve =>
      setTimeout(() => {
        resolve({
          success: true,
          data: { lat: 37.7749, lng: -122.4194 },
        });
      }, 500)
    );
  }
}

export const API = {
  auth: AuthAPI,
  properties: PropertyAPI,
  bookings: BookingAPI,
  reviews: ReviewAPI,
  utils: UtilityAPI,
};