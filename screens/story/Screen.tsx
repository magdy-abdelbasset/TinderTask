import Story from '@/components/users/Story';
import { useUsers, useUsersPaginated } from '@/hooks/useUsers';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function StoryScreen({ screen }: { screen: "home" | "likes" }) {
  // Get users data
  const { data: users, isLoading, error, isError } = useUsers();
  const [allUsers, setAllUsers] = React.useState(users || []);
  const [currentUserIndex, setCurrentUserIndex] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Get pagination data
  const { 
    data: paginatedData, 
    isLoading: isPaginatedLoading,
    error: paginatedError
  } = useUsersPaginated({ 
    page: currentPage, 
    limit: 10 
  });

  // Update store when users are loaded
  useEffect(() => {
    if (users && users.length > 0) {
      setAllUsers(users);
      if (currentUserIndex >= users.length) {
        setCurrentUserIndex(0);
      }
    }
  }, [users]);

  // Handle paginated data loading
  useEffect(() => {
    if (paginatedData && paginatedData.data && currentPage > 1) {
      // Append new users to existing list
      setAllUsers(prevUsers => [...prevUsers, ...paginatedData.data]);
      setIsLoadingMore(false);
    }
  }, [paginatedData, currentPage]);

  // Navigation functions
  const handleNextUser = async () => {
    console.log('handleNextUser called', paginatedData?.pagination.last_page);
    if (allUsers.length > 0) {
      const hasMore = (paginatedData?.pagination.last_page ?? 0) > currentPage;
      const nextIndex = (currentUserIndex + 1) % allUsers.length;
      // Check if we're at the last user and need to load more
      if (nextIndex === 0 && hasMore) {
        setIsLoadingMore(true);
        setCurrentPage(prevPage => prevPage + 1);
        // Don't wrap around to 0, stay at current index until new data loads
        return;
      }
      
      // Check if we're approaching the end (within 3 users) and need to preload
      if (currentUserIndex >= allUsers.length - 3 && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        setCurrentPage(prevPage => prevPage + 1);
      }
      
      setCurrentUserIndex(nextIndex);
      console.log('Navigated to user index:', nextIndex);
    }
  };

  const handlePrevUser = () => {
    if (allUsers.length > 0) {
      const prevIndex = currentUserIndex === 0 ? allUsers.length - 1 : currentUserIndex - 1;
      setCurrentUserIndex(prevIndex);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading users...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error loading users: {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  // No users state
  if (!allUsers || allUsers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No users available</Text>
      </View>
    );
  }

  const currentUser = allUsers[currentUserIndex];

  return (
    <View style={{ flex: 1 }}>
      <Story
        screen={screen}
        onNextUser={handleNextUser}
        onPrevUser={handlePrevUser}
        users={allUsers}
        currentUserIndex={currentUserIndex}
      />
      {isLoadingMore && (
        <View style={{ 
          position: 'absolute', 
          top: 50, 
          right: 20, 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: 8, 
          borderRadius: 4 
        }}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
    </View>
  );
}
