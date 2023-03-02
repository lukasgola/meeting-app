import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';

//Hooks
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';

//Components
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';

//Firebase
import { signInWithEmail } from '../firebase/firebase-config'

import { useCurrentUser } from '../providers/CurrentUserProvider'


export default function SignIn(){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation();
    const { control, handleSubmit, formState: {errors} } = useForm();

    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const { currentUser, setCurrentUser } = useCurrentUser();

    const onSignIn = async data => {
        const { email, password} = data;
        signInWithEmail(email, password);
    };

    const onSignUp = () => {
        navigation.navigate('SignUp')
    }

    const onForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    
    return (
        <KeyboardAvoidingView 
            behavior='padding'
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
            <View style={{ width: 0.9*width }}>
                <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <CustomText weight='bold' size={30} color={colors.primary}>MEETING</CustomText>
                    <CustomText weight='bold' size={30}> APP</CustomText>
                </View>
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    
                    <CustomInput
                        name="email"
                        control={control}
                        placeholder="Email"
                        rules={{
                            required: 'Email is required',
                            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
                        }}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'mail-outline'}
                        keyboardType={'email-address'}
                    />
                </View>
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <CustomInput
                        name="password"
                        placeholder="Password"
                        secureTextEntry
                        control={control}
                        rules={{
                            required: 'Password is required',
                            minLength: {
                            value: 3,
                            message: 'Password should be minimum 3 characters long',
                            },
                        }}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'lock-closed-outline'}
                    />
                </View>
                <TouchableOpacity 
                    onPress={handleSubmit(onSignIn)}
                    style={{ 
                        width: '100%', 
                        height: 50, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20,
                        borderRadius: 10,
                        backgroundColor: colors.primary
                    }}>
                    <CustomText weight='bold' size={18} color={'white'}>Sign in</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onSignUp}
                    style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                    <CustomText color={colors.grey_d}>Don't have account?</CustomText>
                    <CustomText color={colors.primary}>  Sign up!</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onForgotPassword}
                    style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <CustomText color={colors.grey_d}>Forgot password?</CustomText>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
        
}