import { demoUsers } from '@/data';
import { PaginationParams, UsersPaginatedResponse } from '@/types/Pagination';
import { UserInterface } from '@/types/User';
import axios from 'axios';

const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:8000/api',
  timeout: 10000,
};
const auth_user_id = 1; // Simulated authenticated user ID

const api = axios.create(API_CONFIG);

// Add request interceptor for debugging (optional)
api.interceptors.request.use(
  (config) => {
    // console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    const errorMessage = error?.response?.data?.message || 
                        error?.response?.data || 
                        error?.message || 
                        'Unknown API error';
    
    // console.error('API Error:', {
      // status: error?.status,
      // statusText: error.response?.error,
      // message: errorMessage,
      // url: error?.config?.url,
    // });
    if (error.status === 404) {
      console.warn('API Error 404: Not Found');
      return Promise.resolve(error);
      // ToastAndroid.show('', ToastAndroid.SHORT);
    }
    else if (error.status === 409) {
      console.warn('API Error 409: Conflict');
      // ToastAndroid.show('', ToastAndroid.SHORT);
      return Promise.resolve(error);
    }
    console.log('API Error:', error.status);
    
    return Promise.reject(error);
  }
);

export const userAPI = {
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      // console.log('API Health Check: OK');
      return response.status === 200;
    } catch (error: any) {
      console.warn('API Health Check: Failed', error?.message);
      return false;
    }
  },
  // Legacy method for backward compatibility
  getUsers: async (): Promise<UserInterface[]> => {
    const paginatedResult = await userAPI.getUsersPaginated({ page: 1, limit: 15 });
    return paginatedResult.data;
  },

  // New paginated method
  getUsersPaginated: async (params: PaginationParams): Promise<UsersPaginatedResponse> => {
    try {
      // console.log('Attempting to fetch paginated users from API...', params);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
      });

      const response = await api.get(`/users?${queryParams}`);
      
      // console.log('API Response received:', {
      //   status: response.status,
      //   hasData: !!response.data.data,
      //   dataKeys: response.data.data ? Object.keys(response.data.data) : []
      // });
      
      // Handle different possible response structures
      let usersData = null;
      let paginationData = null;

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Standard paginated response: { data: [...], pagination: {...} }
        usersData = response.data.data;
        paginationData = response.data.meta;
      } else {
        throw new Error('Invalid API response format - expected paginated users');
      }
      
      // Transform API data to match UserInterface format
      const users = usersData.map((user: any, index: number) => ({
        id: user.id?.toString() || `${index}`, // Ensure id is string and unique
        name: user.name,
        age: user.age || Math.floor(Math.random() * 30) + 20, // Random age if not provided
        location: user.location ,
        images: user.images , // Cycle through available images
      }));
      
      // console.log('Successfully transformed paginated users:', {
      //   users: users.length,
      //   pagination: paginationData
      // });
      
      return {
        data: users,
        pagination: paginationData
      };
      
    } catch (error: any) {
      console.warn('Paginated API call failed, falling back to demo data:', {
        message: error?.message,
        status: error?.response?.status,
        code: error?.code
      });
      
      // Fallback to demo users with simulated pagination
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const startIndex = (params.page - 1) * 15;
      const endIndex = startIndex + 15;
      const paginatedDemoUsers = demoUsers.slice(startIndex, endIndex);
      
      return {
        data: paginatedDemoUsers,
        pagination: {
          currentPage: params.page,
          totalPages: Math.ceil(demoUsers.length / 15),
          totalItems: demoUsers.length,
          itemsPerPage: 15,
          hasNextPage: endIndex < demoUsers.length,
          hasPreviousPage: params.page > 1,
        }
      };
    }
  },

  getUserById: async (id: string): Promise<UserInterface> => {
    try {
      // console.log(`Attempting to fetch user ${id} from API...`);
      const response = await api.get(`/users/${id}`);
      
      // Handle different possible response structures
      const userData = response.data?.data || response.data;
      
      if (userData) {
        return {
          id: userData.id?.toString() || id,
          name: userData.name || userData.username || 'Unknown User',
          age: userData.age || 25,
          location: userData.location || userData.address?.city || 'Unknown Location',
          images: userData.images || ['@/assets/images/users/user1-1.jpeg'],
        };
      } else {
        throw new Error('User not found in API');
      }
    } catch (error: any) {
      console.warn(`API call failed for user ${id}, falling back to demo data:`, {
        message: error?.message,
        status: error?.response?.status
      });
      
      // Fallback to demo users
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = demoUsers.find(user => user.id === id);
      if (!user) {
        throw new Error(`User with id ${id} not found in demo data`);
      }
      return user;
    }
  },

  likeUser: async (id: string): Promise<boolean> => {
    try {
      const response = await api.post(`/likes`, {
        from_user_id: auth_user_id,
        to_user_id: id
      });
      console.log(`Like user ${id} response:`, { status: response.status });
      return response.status === 200;
    } catch (error: any) {
      console.warn(`Failed to like user ${id}:`, error?.message);
      return false;
    }
  },
  disLikeUser: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/likes/remove`, {
        data: {
          from_user_id: auth_user_id,
          to_user_id: id
        }
      });
      console.log(`Dislike user ${id} response:`, { status: response.status });
      return response.status === 200;
    } catch (error: any) {
      console.warn(`Failed to dislike user ${id}:`, error?.message);
      return false;
    }
  }
};

export default api;
