import { userAPI } from '@/services/api';
import { PaginationParams, UsersPaginatedResponse } from '@/types/Pagination';
import { UserInterface } from '@/types/User';
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult } from '@tanstack/react-query';

// Query keys for caching
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  paginated: (params: Partial<PaginationParams>) => [...userQueryKeys.lists(), 'paginated', params] as const,
  infinite: (params: Omit<PaginationParams, 'page'>) => [...userQueryKeys.lists(), 'infinite', params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

// Hook to fetch all users
export const useUsers = (): UseQueryResult<UserInterface[], Error> => {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: async (): Promise<UserInterface[]> => {
      // console.log('Fetching users...');
      
      try {
        const users = await userAPI.getUsers();
        // console.log('Users fetched successfully:', users.length);
        
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
        
        // console.log('Valid users:', validUsers.length);
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
      // console.log('Fetching user with id:', id);
      
      if (!id || id === '0') {
        throw new Error('Invalid user ID provided');
      }
      
      try {
        const user = await userAPI.getUserById(id);
        // console.log('User fetched successfully:', user.name);
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

// Hook to fetch paginated users
export const useUsersPaginated = (
  params: PaginationParams
): UseQueryResult<UsersPaginatedResponse, Error> => {
  return useQuery({
    queryKey: userQueryKeys.paginated(params),
    queryFn: async (): Promise<UsersPaginatedResponse> => {
      // console.log('Fetching paginated users...', params);
      
      try {
        const result = await userAPI.getUsersPaginated(params);
        // console.log('Paginated users fetched successfully:', {
        //   users: result.data.length,
        //   page: result.pagination.currentPage,
        //   totalPages: result.pagination.totalPages,
        //   totalItems: result.pagination.totalItems
        // });
        
        // Validate user data
        const validUsers = result.data.filter(user => 
          user && 
          user.id && 
          user.id !== '0' && 
          user.name && 
          user.age !== undefined
        );
        
        return {
          ...result,
          data: validUsers
        };
      } catch (error) {
        console.error('useUsersPaginated error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for infinite scroll/pagination
export const useUsersInfinite = (
  params: Omit<PaginationParams, 'page'>
): UseInfiniteQueryResult<UsersPaginatedResponse, Error> => {
  return useInfiniteQuery({
    queryKey: userQueryKeys.infinite(params),
    queryFn: async ({ pageParam = 1 }): Promise<UsersPaginatedResponse> => {
      // console.log('Fetching infinite users...', { ...params, page: pageParam });
      
      try {
        const result = await userAPI.getUsersPaginated({
          ...params,
          page: pageParam as number
        });
        
        // console.log('Infinite users fetched successfully:', {
        //   users: result.data.length,
        //   page: result.pagination.currentPage,
        //   hasNextPage: result.pagination.hasNextPage
        // });
        
        // Validate user data
        const validUsers = result.data.filter(user => 
          user && 
          user.id && 
          user.id !== '0' && 
          user.name && 
          user.age !== undefined
        );
        
        return {
          ...result,
          data: validUsers
        };
      } catch (error) {
        console.error('useUsersInfinite error:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage 
        ? lastPage.pagination.currentPage + 1 
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.hasPreviousPage 
        ? firstPage.pagination.currentPage - 1 
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
