import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTheme} from '../theme/ThemeProvider';

export default function App() {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);

    const {colors} = useTheme();

    

    if (!permission) {
    // Camera permissions are still loading
    return <View />;
    }

    if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
        <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
        </View>
    );
    }

    function toggleCameraType() {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
    }


    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null)
            setImage(data.uri);
        }
    }

    if (permission === false) {
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
                bottom: 50,
                width: '100%',
                height: 200,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <TouchableOpacity 
                    onPress={() => takePicture()} 
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: colors.grey_l,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.grey
                    }}>

                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => toggleCameraType() }
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.grey_l,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Ionicons name={'repeat-outline'} size={25} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
}