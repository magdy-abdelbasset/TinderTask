import { demoUsers } from '@/data';
import { UserInterface } from '@/types/User';
import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:8000/api',
  timeout: 10000,
};

console.log('API Configuration:', API_CONFIG);

// Create axios instance
const api = axios.create(API_CONFIG);

// Add request interceptor for debugging (optional)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    // Better error handling with type safety
    const errorMessage = error?.response?.data?.message || 
                        error?.response?.data || 
                        error?.message || 
                        'Unknown API error';
    
    console.error('API Error:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: errorMessage,
      url: error?.config?.url,
    });
    
    return Promise.reject(error);
  }
);

// API functions
export const userAPI = {
  // Health check function to test API connectivity
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      console.log('API Health Check: OK');
      return response.status === 200;
    } catch (error: any) {
      console.warn('API Health Check: Failed', error?.message);
      return false;
    }
  },
  getUsers: async (): Promise<UserInterface[]> => {
    try {
      console.log('Attempting to fetch users from API...');
      const response = await api.get('/users');
      
      console.log('API Response received:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });
      
      // Handle different possible response structures
      let usersData = null;
      if (response.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else {
        throw new Error('Invalid API response format - expected array of users');
      }
      
      // Transform API data to match UserInterface format
      const users = usersData.map((user: any, index: number) => ({
        id: user.id?.toString() || `api-user-${index}`, // Ensure id is string and unique
        name: user.name || user.username || `User ${index + 1}`,
        age: user.age || Math.floor(Math.random() * 30) + 20, // Random age if not provided
        location: user.location || user.address?.city || 'Unknown Location',
        images: user.images || [`@/assets/images/users/user${(index % 5) + 1}-1.jpeg`], // Cycle through available images
      }));
      
      console.log('Successfully transformed API users:', users.length);
      return users;
      
    } catch (error: any) {
      console.warn('API call failed, falling back to demo data:', {
        message: error?.message,
        status: error?.response?.status,
        code: error?.code
      });
      
      // Fallback to demo users if API fails
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return demoUsers;
    }
  },

  getUserById: async (id: string): Promise<UserInterface> => {
    try {
      console.log(`Attempting to fetch user ${id} from API...`);
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
};

export default api;
