import { TouchableOpacity } from "react-native";
interface ButtonIconProps {
    key?: string | number;
    width?: number;
    height?: number;
    radius?: number;
    icon: React.ReactNode;
    className?: string;
    onPress?: () => void;
}

export default function ButtonIcon({ key, width, height, radius, icon,className, onPress }: ButtonIconProps) {
    return (

        <TouchableOpacity onPress={onPress}
            className={`items-center justify-center flex ${className}`}
            key={key}
            style={{
                width: width,
                height: height,
                borderRadius: radius,
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

                { icon }
        </TouchableOpacity>
    );
}
