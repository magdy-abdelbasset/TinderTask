import { StyleSheet } from 'react-native';

export const loadingStyles = StyleSheet.create({
  loadingNextContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 12, 81, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderRadius: 20,
    zIndex: 1000,
  },
  loadingNextText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  }
});