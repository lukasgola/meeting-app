import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {useForm, Controller} from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';

//Firebase
import { forgotPassword } from '../firebase/firebase-config';




export default function ForgotPassword({navigation}){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const route = useRoute();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {email: route?.params?.email}
    });

    const email = watch('email');

    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const onSend = async data => {

        forgotPassword(data.email)
        navigation.navigate('SignIn')
    };

    const onSignIn = () => {
        navigation.navigate('SignIn');
    };



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
            <View style={{ width: 0.9*width }}>
                <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomText weight='bold' size={30}>Reset password</CustomText>
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
                    />
                </View>
                <TouchableOpacity 
                    onPress={handleSubmit(onSend)}
                    style={{ 
                        width: '100%', 
                        height: 50, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20,
                        borderRadius: 10,
                        backgroundColor: colors.primary
                    }}>
                    <CustomText weight='bold' size={18} color={'white'}>Send</CustomText>
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