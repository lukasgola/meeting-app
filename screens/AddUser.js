import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useForm, Controller} from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';

//Firebase
import { createUserWithEmail } from '../firebase/firebase-config'

export default function AddUser(){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const route = useRoute();
    const navigation = useNavigation()
    const { control, handleSubmit } = useForm();

    const getRandomProfilePicture = async () => {
        const response = await fetch('https://randomuser.me/api')
        const data = await response.json();
        return data.results[0].picture.large;
    }


    const onConfirm = async data => {

        const avatar = await getRandomProfilePicture();

        createUserWithEmail(route.params.email, route.params.password, data.username, avatar);
    };

    const onSignIn = () => {
        navigation.navigate('SignIn')
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
            <View style={{ width: 0.9*width }}>
                <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomText weight='bold' size={30}>Confirm your email</CustomText>
                </View>
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    
                    <CustomInput
                        name="username"
                        placeholder="Username"
                        control={control}
                        rules={{required: 'Username is required'}}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'lock-closed-outline'}
                    />
                </View>
                <TouchableOpacity 
                    onPress={handleSubmit(onConfirm)}
                    style={{ 
                        width: '100%', 
                        height: 50, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20,
                        borderRadius: 10,
                        backgroundColor: colors.primary
                    }}>
                    <CustomText weight='bold' size={18} color={'white'}>Confirm</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onSignIn}
                    style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                    <CustomText color={colors.grey_d}>Back to  </CustomText>
                    <CustomText color={colors.primary}>Sign In</CustomText>
                </TouchableOpacity>
            </View>
            
        </View>
    );
}