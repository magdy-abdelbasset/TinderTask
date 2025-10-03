import { UserInterface } from '@/types/User';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from './useUsers';

// Example mutation for creating a user (you'll need to implement the API function)
export const useCreateUser = (): UseMutationResult<
  UserInterface,
  Error,
  Omit<UserInterface, 'id'>
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<UserInterface, 'id'>): Promise<UserInterface> => {
      // This would be implemented in your API service
      // return userAPI.createUser(userData);
      throw new Error('Create user API not implemented yet');
    },
    onSuccess: (newUser: UserInterface) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      
      // Optionally add the new user to the cache
      queryClient.setQueryData(userQueryKeys.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
};

// Example mutation for updating a user
export const useUpdateUser = (): UseMutationResult<
  UserInterface,
  Error,
  { id: string; userData: Partial<UserInterface> }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }): Promise<UserInterface> => {
      // This would be implemented in your API service
      // return userAPI.updateUser(id, userData);
      throw new Error('Update user API not implemented yet');
    },
    onSuccess: (updatedUser: UserInterface) => {
      // Update the user in cache
      queryClient.setQueryData(
        userQueryKeys.detail(updatedUser.id),
        updatedUser
      );
      
      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
};

// Example mutation for deleting a user
export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // This would be implemented in your API service
      // return userAPI.deleteUser(userId);
      throw new Error('Delete user API not implemented yet');
    },
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
      
      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
};
