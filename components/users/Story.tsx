import { UserInterface } from "@/types/User";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import React, { useRef, useState } from "react";

import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface StoryProps {
    user: UserInterface;
    onNextUser: () => void;
    onPrevUser: () => void;
    users: UserInterface[];
    currentUserIndex: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Story({ user, onNextUser, onPrevUser, users, currentUserIndex }: StoryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    // Handle image navigation (left/right tap)
    const handleImageTap = (event: any) => {
        const { locationX } = event.nativeEvent;
        const isLeftSide = locationX < screenWidth / 2;

        if (isLeftSide) {
            // Left tap - previous image
            if (currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1);
            }
        } else {
            // Right tap - next image
            if (currentImageIndex < user.images.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
            }
        }
    };

    // Pan responder for user navigation (swipe left/right)
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt: any, gestureState: any) => {
            return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
        },
        onPanResponderRelease: (evt: any, gestureState: any) => {
            const { dx } = gestureState;

            if (Math.abs(dx) > 100) { // Minimum swipe distance
                if (dx > 0) {
                    // Swipe right - previous user
                    if (currentUserIndex > 0) {
                        animateUserChange(() => onPrevUser());
                    }
                } else {
                    // Swipe left - next user
                    if (currentUserIndex < users.length - 1) {
                        animateUserChange(() => onNextUser());
                    }
                }
            } else {
                // Return to original position
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },
        onPanResponderMove: (evt: any, gestureState: any) => {
            translateX.setValue(gestureState.dx);
        },
    });

    const animateUserChange = (callback: () => void) => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            callback();
            setCurrentImageIndex(0); // Reset to first image when changing users
            translateX.setValue(0);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    if (!user || !user.images || user.images.length === 0) {
        return null;
    }

    return (
        <View
            className="flex-1 flex-col justify-center items-between"
            style={{
                width: screenWidth,
                backgroundColor: 'white',
                overflow: 'visible', // Allow shadows to show outside
            }}
        >
            <View
                className="flex-1 justify-center items-center"
                style={{ overflow: 'visible' }} // Allow shadows to show outside
            >

                <Animated.View
                    style={{
                        flex: 1,
                        backgroundColor: 'white',
                        transform: [
                            { translateX },
                            {
                                rotate: translateX.interpolate({
                                    inputRange: [-screenWidth, 0, screenWidth],
                                    outputRange: ['-15deg', '0deg', '15deg'],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                        opacity,
                        // Add overflow visible to allow shadows to show
                        overflow: 'visible',
                    }}
                    {...panResponder.panHandlers}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleImageTap}
                        style={{
                            flex: 1,
                            overflow: 'visible', // Allow shadows to show outside
                        }}
                    >
                        {/* Shadow container */}
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
                                        width: screenWidth,
                                        flex: 1,
                                    }}
                                />
                            </View>
                        </View>

                        {/* Image indicators */}
                        <View className="absolute top-2 left-0 right-0 flex-row justify-center z-10">
                            {user.images.map((_, index) => (
                                <View
                                    key={index}
                                    className={`h-1 mx-1 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-black'
                                        }`}
                                    style={{
                                        width: screenWidth / user.images.length - 8,
                                    }}
                                />
                            ))}
                        </View>

                        {/* User info overlay */}
                        <View className="absolute bottom-12 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <Text className="text-white text-3xl font-bold mb-1">
                                {user.name}, {user.age}
                            </Text>
                            {user.location && (
                                <Text className="text-white/90 text-lg">
                                    📍 {user.location}
                                </Text>
                            )}
                        </View>

                        {/* Navigation hints */}
                        <View className="absolute top-0 left-0 w-1/2 h-full" />
                        <View className="absolute top-0 right-0 w-1/2 h-full" />
                    </TouchableOpacity>
                </Animated.View>

                {/* User navigation indicators */}
                <View
                    className="absolute left-0 right-0 flex-row items-center justify-between px-10"
                    style={{
                        bottom: -40,
                        zIndex: 1000,
                        paddingBottom: 20, // More padding to prevent shadow clipping
                        overflow: 'visible', // Allow shadows to show outside
                    }}
                >
                    {[1].map((_, index) => (
                        <View
                            className="items-center justify-center flex"
                            key={index}
                            style={{
                                width: index % 2 === 0 ? 48 : 64,
                                height: index % 2 === 0 ? 48 : 64,
                                borderRadius: index % 2 === 0 ? 24 : 32,
                                backgroundColor: 'white',
                                marginHorizontal: 8, // More margin to accommodate shadow
                                overflow: 'visible', // Allow shadows to show outside
                                // iOS shadow - stronger and more spread out
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 15,
                            }}>

                            <AntDesign name="reload" className="bolder"       style={{ transform: [{ scaleX: -1 }], direction: 'ltr'}} size={28} color="#f8ce13" />
                        </View>
                    ))}
                    <View
                        className="items-center justify-center flex"
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: 'white',
                                marginHorizontal: 8, // More margin to accommodate shadow
                                overflow: 'visible', // Allow shadows to show outside
                                // iOS shadow - stronger and more spread out
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 15,
                            }}>

                            <Entypo name="cross" size={54} color="#ef2e6c" />
                        </View>
                        <View
                            className="items-center justify-center flex"
                            style={{
                                width:  48,
                                height:48,
                                borderRadius: 24 ,
                                backgroundColor: 'white',
                                marginHorizontal: 8, // More margin to accommodate shadow
                                overflow: 'visible', // Allow shadows to show outside
                                // iOS shadow - stronger and more spread out
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 15,
                            }}>

                            <AntDesign name="star" size={24} color="#0188f9" />
                        </View>
                    <View
                        className="items-center justify-center flex"
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: 'white',
                                marginHorizontal: 8, // More margin to accommodate shadow
                                overflow: 'visible', // Allow shadows to show outside
                                // iOS shadow - stronger and more spread out
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 15,
                            }}>

                            <AntDesign name="heart" size={38} color="#57c851" />
                        </View>
                    <View
                        className="items-center justify-center flex"
                        style={{

                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'white',
                            marginHorizontal: 8, // More margin to accommodate shadow
                            overflow: 'visible', // Allow shadows to show outside
                            // iOS shadow - stronger and more spread out
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            elevation: 15,
                        }}>

                        <EvilIcons name="sc-telegram" size={34} color="#0c88f5" />
                    </View>
                </View>

            </View>
            <View className="h-20 bg-white">
            </View>
        </View>
    );
}
