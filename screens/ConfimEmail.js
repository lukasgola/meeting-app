import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import CustomInput from '../components/CustomInput';

import { Auth } from 'aws-amplify';

import {useForm, Controller} from 'react-hook-form';

import { useRoute } from '@react-navigation/native';


export default function ConfirmEmail({navigation}){

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {colors} = useTheme();

    const [loading, setLoading] = useState(false);

    const route = useRoute();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {username: route?.params?.username}
    });

    const username = watch('username');

    const onConfirm = async data => {

        if(loading){
            return;
        }  
        setLoading(true);

        try {
            await Auth.confirmSignUp(data.username, data.code);
            navigation.navigate('SignIn');
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
        setLoading(false);
    };

    const onSignIn = () => {
        navigation.navigate('SignIn')
    }

    const onResend = async () => {
        try {
            await Auth.resendSignUp(username);
            Alert.alert('Success', 'Code was resent to your email');
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
    };



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
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <CustomInput
                            name="code"
                            control={control}
                            placeholder="Enter your confirmation code"
                            rules={{
                                required: 'Confirmation code is required',
                            }}
                            size={12} 
                            color={colors.grey_l} 
                            icon={'barcode-outline'}
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
                        <CustomText weight='bold' size={18} color={'white'}>{loading ? 'Loading...' : 'Confirm'}</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={onResend}
                        style={{ 
                            width: '100%', 
                            height: 50, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            marginTop: 20,
                            borderRadius: 10,
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.primary
                        }}>
                        <CustomText weight='bold' size={18} color={colors.text}>{'Resend Code'}</CustomText>
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