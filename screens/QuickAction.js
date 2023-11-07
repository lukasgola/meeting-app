import React, { useState, useEffect } from 'react';
import { Dimensions ,Text, View, Button, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Alert} from 'react-native';
import { Camera } from 'expo-camera';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomMultilineInput from '../components/CustomMultilineInput';

import {useTheme} from '../theme/ThemeProvider';
import {useForm, Controller} from 'react-hook-form';

import CustomText from '../components/CustomText';


//Firebase
import { auth, uploadImage, addQuickAction } from '../firebase/firebase-config';

export default function QuickAction({navigation}) {



    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);

    const {colors} = useTheme();

    const { control, handleSubmit, formState: {errors} } = useForm();

    const onCreateQuickEvent = async data => {
        Alert.alert('New Quick Action', 'Do you want to public this Quick Action? Your location will become public until you turn it off and everyone will be able to see your photo', [
        {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
        },
        {
            text: 'Yes',
            onPress: async () => {
                const {description} = data;
                const url = await uploadImage(auth.currentUser.uid, image, 'quickActions')
                const event = {
                    image: url,
                    desc: description == undefined ? '' : description
                }
                await addQuickAction(event);
                navigation.goBack();
                
            }},
        ]);
        
    };

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


    const retake = () => {
        setImage(null)
    }

    if (permission === false) {
        return <Text>No access to camera</Text>;
    }

    if (image == null){

    return (
        <View style={{ flex: 1}}>
            <Camera 
                ref={ref => setCamera(ref)}
                type={type}
                ratio="1:1"
                style={{flex: 1}}
            />
            <View 
                style={{
                    position: 'absolute',
                    bottom: 50,
                    width: '100%',
                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
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
    } else {

    return (
        <KeyboardAvoidingView 
            behavior='padding'
            keyboardShouldPersistTaps='handled'
            style={{ flex: 1, padding: '5%', justifyContent: 'space-around'}}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <Image 
                    source={{uri: image}}
                    style={{
                        width: '100%',
                        height: '70%',
                        borderRadius: 10,

                    }}
                />
            </TouchableWithoutFeedback>
                <View style={{
                    width: '100%',
                    height: '10%',
                }}>
                    <CustomMultilineInput
                        name="description"
                        control={control}
                        placeholder="Write a few words about the event ..."
                        size={12} 
                        color={colors.grey_l} 
                        multiline={true}
                    />
                </View>
                
                <View style={{
                    width: '100%',
                    marginBottom: '10%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                }}>
                    <TouchableOpacity 
                        onPress={() => retake()} 
                        style={{
                            width: '30%',
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: colors.background,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CustomText weight='bold'>RETAKE</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleSubmit(onCreateQuickEvent)}
                        style={{
                            width: '60%',
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CustomText weight='bold' color={colors.background}>NEXT</CustomText>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>
    )
    }
}