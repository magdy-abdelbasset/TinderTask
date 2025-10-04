import { Image, View } from "react-native";


export default function ImageOfStore({ imageUrl ,screenWidth}: { imageUrl: string ,screenWidth:number}) {
  // console.log('ImageOfStore - imageSource:', imageUrl);

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
          source={{ uri: imageUrl }}
          style={{
            width: screenWidth,
            flex: 1,
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}