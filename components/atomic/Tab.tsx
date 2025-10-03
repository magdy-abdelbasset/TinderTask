import { View } from "react-native";

export default function TabOfImage({ index, active, width }: { index: number; active: boolean; width: number }) {
    return (
        <>
            <View
                key={index}
                className={`h-1 mx-1 rounded-full ${active ? 'bg-white' : 'bg-black'
                    }`}
                style={{
                    width: width,
                }}
            />
        </>
    );
}
