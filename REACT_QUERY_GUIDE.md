# React Query Implementation

This project now uses **TanStack React Query** (formerly React Query) with **Axios** for efficient data fetching and state management.

## 📁 File Structure

```
services/
  api.ts              # Axios configuration and API functions
hooks/
  useUsers.ts         # React Query hooks for user data
  useUserMutations.ts # React Query mutations (create, update, delete)
providers/
  QueryProvider.tsx   # React Query client provider
```

## 🚀 Key Features

- **Automatic caching** - Data is cached for 10 minutes
- **Background refetching** - Data stays fresh with 5-minute stale time
- **Loading states** - Built-in loading, error, and success states
- **Retry logic** - Automatic retry with exponential backoff
- **Optimistic updates** - UI updates immediately, syncs with server
- **Request deduplication** - Multiple identical requests are merged

## 📝 Usage Examples

### Fetching Users

```tsx
import { useUsers } from '@/hooks/useUsers';

function MyComponent() {
  const { data: users, isLoading, error, isError } = useUsers();

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <Text>Error: {error?.message}</Text>;

  return (
    <View>
      {users?.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### Fetching Single User

```tsx
import { useUser } from '@/hooks/useUsers';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <ActivityIndicator />;

  return <Text>{user?.name}</Text>;
}
```

### Using Mutations (Future Implementation)

```tsx
import { useCreateUser } from '@/hooks/useUserMutations';

function CreateUserForm() {
  const createUserMutation = useCreateUser();

  const handleSubmit = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        console.log('User created successfully!');
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
      }
    });
  };

  return (
    <Button 
      onPress={() => handleSubmit(newUserData)}
      disabled={createUserMutation.isPending}
    >
      {createUserMutation.isPending ? 'Creating...' : 'Create User'}
    </Button>
  );
}
```

## 🔧 Configuration

### Query Configuration (in `useUsers.ts`)
- **staleTime**: 5 minutes - How long data is considered fresh
- **gcTime**: 10 minutes - How long data stays in cache
- **retry**: 3 attempts with exponential backoff

### API Configuration (in `api.ts`)
- **baseURL**: Currently set to JSONPlaceholder for demo
- **timeout**: 10 seconds
- **interceptors**: Request/response logging and error handling

## 🔄 Cache Management

React Query automatically manages cache with these key concepts:

1. **Fresh Data**: Recently fetched data (within staleTime)
2. **Stale Data**: Data that might need refetching
3. **Inactive Data**: Data not currently being used by any component
4. **Garbage Collection**: Removes unused data after gcTime

## 🛠 Next Steps

1. **Replace demo API**: Update `services/api.ts` with your real API endpoints
2. **Add authentication**: Include auth tokens in API requests
3. **Implement mutations**: Add create, update, delete operations
4. **Add optimistic updates**: Update UI before server confirms changes
5. **Add offline support**: Cache data for offline usage

## 🎯 Benefits

- **Better UX**: Instant loading from cache, background updates
- **Less boilerplate**: No need to manage loading/error states manually
- **Performance**: Intelligent caching and request deduplication
- **Developer experience**: Great DevTools and debugging capabilities
