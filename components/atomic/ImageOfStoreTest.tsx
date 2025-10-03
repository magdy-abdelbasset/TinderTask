import { useState } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

interface ImageOfStoreProps {
  imageSource: ImageSourcePropType | string;
}

export default function ImageOfStore({ imageSource }: ImageOfStoreProps) {
  console.log('ImageOfStore - imageSource:', imageSource);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useTestImage, setUseTestImage] = useState(false);
  
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

  // Test with a known working HTTPS image
  const getTestImageSource = () => {
    return { uri: 'https://randomuser.me/api/portraits/men/1.jpg' };
  };

  // Fallback to local image if remote image fails
  const getFallbackSource = () => {
    return require('@/assets/images/users/user1-1.jpeg');
  };

  const getImageSource = () => {
    if (useTestImage) {
      return getTestImageSource();
    }
    if (imageError) {
      return getFallbackSource();
    }
    return typeof imageSource === 'string' ? { uri: imageSource } : imageSource;
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
        className="rounded-b-3xl h-full"
        style={{
          flex: 1,
          overflow: 'hidden',
          backgroundColor: 'white', // Ensure background for shadow
        }}
      >
        <Image
          className="h-full rounded-b-3xl"
          source={getImageSource()}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            backgroundColor: imageLoaded ? "transparent" : "red",
            width: '100%',
            resizeMode: 'cover',
            flex: 1,
          }}
        />
        
        {/* Debug controls - remove this in production */}
        <View style={{
          position: 'absolute',
          top: 10,
          right: 10,
          flexDirection: 'column',
          gap: 5
        }}>
          <TouchableOpacity
            onPress={() => setUseTestImage(!useTestImage)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: 5,
              borderRadius: 3
            }}
          >
            <Text style={{ color: 'white', fontSize: 10 }}>
              {useTestImage ? 'Original' : 'Test HTTPS'}
            </Text>
          </TouchableOpacity>
          
          {!imageLoaded && !imageError && (
            <View style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: 5,
              borderRadius: 3
            }}>
              <Text style={{ color: 'white', fontSize: 10 }}>Loading...</Text>
            </View>
          )}
          
          {imageError && (
            <View style={{
              backgroundColor: 'rgba(255,0,0,0.7)',
              padding: 5,
              borderRadius: 3
            }}>
              <Text style={{ color: 'white', fontSize: 10 }}>Failed - Using fallback</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
