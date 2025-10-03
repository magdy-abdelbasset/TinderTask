import { userAPI } from '@/services/api';
import { UserInterface } from '@/types/User';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

// Query keys for caching
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

// Hook to fetch all users
export const useUsers = (): UseQueryResult<UserInterface[], Error> => {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: async (): Promise<UserInterface[]> => {
      console.log('Fetching users...');
      
      try {
        const users = await userAPI.getUsers();
        console.log('Users fetched successfully:', users.length);
        
        // Validate user data
        const validUsers = users.filter(user => 
          user && 
          user.id && 
          user.id !== '0' && 
          user.name && 
          user.age !== undefined
        );
        
        if (validUsers.length === 0) {
          throw new Error('No valid users found');
        }
        
        console.log('Valid users:', validUsers.length);
        return validUsers;
      } catch (error) {
        console.error('useUsers error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch a single user by ID
export const useUser = (id: string): UseQueryResult<UserInterface, Error> => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: async (): Promise<UserInterface> => {
      console.log('Fetching user with id:', id);
      
      if (!id || id === '0') {
        throw new Error('Invalid user ID provided');
      }
      
      try {
        const user = await userAPI.getUserById(id);
        console.log('User fetched successfully:', user.name);
        return user;
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id && id !== '0', // Only run query if valid id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
