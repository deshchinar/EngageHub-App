import { Platform, Alert, Linking } from "react-native"
import { check, request, PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from "@react-native-async-storage/async-storage";


const updateDenyCount = async (type: 'camera' | 'library'): Promise<void> => {
    try {
        let permissionDenied: number = 0;
        let key: string = '';

        if (type === 'camera') {
            key = 'permissionsDeniedCamera';
        } else if (type === 'library') {
            key = 'permissionsDeniedLibrary';
        }

        const storedValue = await AsyncStorage.getItem(key);
        permissionDenied = storedValue ? Number(storedValue) : 0;
        permissionDenied += 1;

        console.log(`Permission Denied ${type.charAt(0).toUpperCase() + type.slice(1)}: `, permissionDenied);

        await AsyncStorage.setItem(key, permissionDenied.toString());

        if (permissionDenied >= 3) {
            Alert.alert(
                "Permission Denied",
                `You have denied ${type} access 2 or more times. Now you have to enable access manually.`,
                [
                    {
                        text: "Enable", onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:');
                            } else {
                                Linking.openSettings();
                            }
                        }
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    }
                ]
            );
        }
    } catch (error) {
        console.log(error);
    }
}
const PERMISSION_OUTPUT_MAP = Object.freeze({
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
});
 
/**
* @param void
* @returns boolen
* @description
*  Fist checks the permission or otherwise requests
*  the permission for both android and IOS.
*/
export const checkOrRequestPermissionForGallery = async (permissionText: any) => {
    let hasPermission = true;
    const cameraPermission = Platform.OS === "android"
        ? permissionText : PERMISSIONS.IOS.CAMERA;
 
    const checkPermissionResult = await check(cameraPermission);
    hasPermission = checkPermissionResult === PERMISSION_OUTPUT_MAP.GRANTED || checkPermissionResult === PERMISSION_OUTPUT_MAP.LIMITED
 
    if (!hasPermission) {
        console.log("INSIDE IF ", hasPermission)
 
        const requestPermissionResult = await request(cameraPermission, {
            title: "App Gallery Permission",
            message: "App needs access to your gallery ",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        });
        console.log("LHS Condition", requestPermissionResult);
        console.log("RHS Condition", PERMISSION_OUTPUT_MAP.DENIED);
        if (requestPermissionResult === PERMISSION_OUTPUT_MAP.DENIED || PERMISSION_OUTPUT_MAP.BLOCKED) {
            await updateDenyCount('camera');
        }
        hasPermission = requestPermissionResult === PERMISSION_OUTPUT_MAP.GRANTED || requestPermissionResult === PERMISSION_OUTPUT_MAP.LIMITED
 
    }
    return hasPermission
}
 

export const checkOrRequestPermissionForCamera = async (permissionText : any) => {
    let hasPermission = true;
    const cameraPermission = Platform.OS === "android"
        ? permissionText : PERMISSIONS.IOS.CAMERA;
 
    const checkPermissionResult = await check(cameraPermission);
    hasPermission = checkPermissionResult === PERMISSION_OUTPUT_MAP.GRANTED || checkPermissionResult === PERMISSION_OUTPUT_MAP.LIMITED
 
    if (!hasPermission) {
        console.log("INSIDE IF ", hasPermission)
 
        const requestPermissionResult = await request(cameraPermission, {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        });
        console.log("LHS Condition", requestPermissionResult);
        console.log("RHS Condition", PERMISSION_OUTPUT_MAP.DENIED);
        if (requestPermissionResult === PERMISSION_OUTPUT_MAP.DENIED || PERMISSION_OUTPUT_MAP.BLOCKED) {
            await updateDenyCount('camera');
        }
        hasPermission = requestPermissionResult === PERMISSION_OUTPUT_MAP.GRANTED || requestPermissionResult === PERMISSION_OUTPUT_MAP.LIMITED
 
    }
    return hasPermission
}

type EmotionLevelAndEmoji = {
    eLevel: number;
    emoji: string;
};

export const getEmotionLevelAndEmoji = (output: string): EmotionLevelAndEmoji =>  {
    console.log('OUTPUR&&&&&&&&&&&', output)
    switch (output) {
        case "Surprise":
            return { eLevel: 5, emoji: "😲" };
        case "Fear":
            return { eLevel: 4, emoji: "😨" };
        case "Angry":
            return { eLevel: 4, emoji: "😠" };
        case "Happy":
            return { eLevel: 3, emoji: "😊" };
        case "Sad":
            return { eLevel: 3, emoji: "😢" };
        case "Neutral":
            return { eLevel: 2, emoji: "😐" };
        case "No emotion detected":
            return { eLevel: 1, emoji: "❓" };
        default:
            return { eLevel: 0, emoji: "❓" };
    }
}