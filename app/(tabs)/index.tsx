import Story from '@/components/users/Story';
import { demoUsers } from '@/data';
import { UserInterface } from '@/types/User';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  useEffect(() => {
    // Simulate fetching user data from an API
    const fetchUserData = async () => {
      setUsers(demoUsers);
    };

    fetchUserData();
  }, []);

  const handleNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const handlePrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  return (
    <Story
      user={users[currentUserIndex]}
      onNextUser={handleNextUser}
      onPrevUser={handlePrevUser}
      users={users}
      currentUserIndex={currentUserIndex}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff2fc',
  },
  header: {
    backgroundColor: '#f10c51ff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#f10c51ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
