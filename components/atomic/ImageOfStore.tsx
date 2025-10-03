import { useState } from "react";
import { Image, ImageSourcePropType, View } from "react-native";

interface ImageOfStoreProps {
  imageSource: ImageSourcePropType | string;
}

export default function ImageOfStore({ imageSource }: ImageOfStoreProps) {
  console.log('ImageOfStore - imageSource:', imageSource);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = (error: any) => {
    console.error('Image loading error:', error.nativeEvent);
    console.error('Failed to load image:', imageSource);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSource);
    setImageLoaded(true);
    setImageError(false);
  };

  // Fallback to local image if remote image fails
  const getFallbackSource = () => {
    return require('@/assets/images/users/user1-1.jpeg');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        overflow: 'visible', // Allow shadows to extend outside
        // Bottom shadow for the image
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <View
        className="rounded-b-3xl"
        style={{
          flex: 1,
          overflow: 'hidden',
          backgroundColor: 'white', // Ensure background for shadow
        }}
      >
        <Image
          className="h-full rounded-b-3xl"
          source={require(`@/assets/images/users/user5-1.jpeg`)}
          style={{
            width: "100%",
            flex: 1,
          }}
        />
      </View>
    </View>
  );
}