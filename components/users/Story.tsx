import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import React, { useRef, useState } from "react";
import TabOfImage from "../atomic/Tab";


import { userAPI } from '@/services/api';
import { UserInterface } from '@/types/Pagination';
import {
    Animated,
    Dimensions,
    PanResponder,
    TouchableOpacity,
    View
} from "react-native";
import ButtonIcon from "../atomic/ButtonIcon";
import ImageOfStore from "../atomic/ImageOfStore";
import NavigationHint from "../atomic/NavigationHint";
import UserInfo from "../atomic/UserInfo";

interface StoryProps {
    onNextUser: () => void;
    onPrevUser: () => void;
    users: UserInterface[];
    currentUserIndex: number;
    screen:"home" | "likes";
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Story({  onNextUser , onPrevUser, users, currentUserIndex , screen }: StoryProps) {
    const user = users[currentUserIndex] || null;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const [imageUrl, setImageUrl] = useState<string>(user.images[0]);
    const handleImageTap = (event: any) => {
        const { locationX } = event.nativeEvent;
        const isLeftSide = locationX < screenWidth / 2;

        if (isLeftSide) {
            if (currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1);
                setImageUrl(user.images[currentImageIndex - 1]);
            }
        } else {
            if (currentImageIndex < user.images.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
                setImageUrl(user.images[currentImageIndex + 1]);
            }
        }
    };
    const giveLike = () => {
        userAPI.likeUser(user.id);
        setImageUrl(user.images[0]); // Reset image for next user
        onNextUser();
    }
    const giveDislike = () => {
        userAPI.disLikeUser(user.id);
        setImageUrl(user.images[0]); // Reset image for next user
        onNextUser();
    }
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
                        setCurrentImageIndex(0); // Reset image index for new user
                        setImageUrl(users[currentUserIndex + 1].images[0]); // Set image for next user
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
            className="flex-1 flex flex-col justify-center items-between"
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
                        <ImageOfStore imageUrl={imageUrl} screenWidth={screenWidth} />
                        {/* <Image source={{ uri: user.images[currentImageIndex]}}/> */}
                        <View className="absolute top-2 left-0 right-0 flex-row justify-center z-10">
                            {user.images.map((_, index) => (
                                <TabOfImage key={index} index={index} active={index === currentImageIndex} width={screenWidth / user.images.length - 8} />
                            ))}
                        </View>
                        <UserInfo user={user} />
                        <NavigationHint direction="left" />
                        <NavigationHint direction="right" />
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
                    {screen === "home" && (

                    <ButtonIcon icon={
                        <AntDesign name="reload" className="bolder" style={{ transform: [{ scaleX: -1 }], direction: 'ltr' }} size={28} color="#f8ce13" />
                    } width={48} height={48} radius={24} />
                    )}
                    <ButtonIcon onPress={giveDislike} className={screen === "likes" ? "ml-[72px]" :""} icon={
                        <Entypo name="cross" size={54} color="#ef2e6c" />
                    } width={64} height={64} radius={32} />
                    {screen === "home" && (
                      <>
                    <ButtonIcon icon={
                        <AntDesign name="star" size={32} color="#0188f9" />
                    } width={48} height={48} radius={24} />
                    <ButtonIcon onPress={giveLike} icon={
                        <AntDesign name="heart" size={42} color="#57c851" />
                    } width={64} height={64} radius={32} />
                    <ButtonIcon icon={
                        <EvilIcons name="sc-telegram" size={36} color="#0c88f5" />
                    } width={48} height={48} radius={24} />
                      </>  
                    )}

                </View>

            </View>
            <View className="h-20 bg-white">
            </View>
        </View>
    );
}
