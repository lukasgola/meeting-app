import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import CustomInput from '../components/CustomInput';

import { Auth } from 'aws-amplify';

import {useForm, Controller} from 'react-hook-form';



export default function ForgotPassword({navigation}){

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {colors} = useTheme();

    const [loading, setLoading] = useState(false);

    const {control, handleSubmit} = useForm();


    const onSend = async data => {

        if(loading){
            return;
        }
        setLoading(true);
        try {
            await Auth.forgotPassword(data.username);
            navigation.navigate('NewPassword');
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
        setLoading(false);
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
                        <CustomText weight='bold' size={18} color={'white'}>{loading ? 'Loading...' : 'Send'}</CustomText>
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