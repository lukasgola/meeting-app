import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';

import CustomText from '../components/CustomText';

import {useTheme} from '../theme/ThemeProvider';

export default function App() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const {colors} = useTheme();

    useEffect(() => {
        (async () => {
        const cameraStatus = await Camera.requestPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    })();
    }, []);


    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null)
            setImage(data.uri);
        }
    }

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'red'}}>
            <Camera 
                ref={ref => setCamera(ref)}
                type={type}
                style={{flex: 1}}
            />
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            }}>
                <TouchableOpacity 
                    onPress={() => {
                        setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                    }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.grey
                    }}
                />

                <TouchableOpacity 
                    title="Take Picture" 
                    onPress={() => takePicture()} 
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.grey
                    }}
                />
            </View>
        </View>
    );
}