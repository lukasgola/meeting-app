import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import CustomInput from '../components/CustomInput';

import { Auth } from 'aws-amplify';

import {useForm, Controller} from 'react-hook-form';


export default function SignIn({navigation}){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);


    const {
        control,
        handleSubmit,
        formState: {errors},
      } = useForm();


    const onSignIn = async data => {

        if(loading){
            return;
        }
        setLoading(true);
        try {
            const { user } = await Auth.signIn( data.username, data.password );
            console.log(user);
            setIsLoaded(true);
        } catch (error) {
            Alert.alert('error signing up:', error.message);
            //console.log('error signing up:', error);
        }
        
        setLoading(false);
        
        
    };

    const onSignUp = () => {
        navigation.navigate('SignUp')
    }

    const onForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
            {isLoaded ? 
            (
                <ActivityIndicator />
            ):(
                <View style={{ width: 0.9*width }}>
                    <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <CustomText weight='bold' size={30}>BRYNOL</CustomText>
                    </View>
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        
                        <CustomInput
                            name="username"
                            placeholder="Username"
                            control={control}
                            rules={{required: 'Username is required'}}
                            size={12} 
                            color={colors.grey_l} 
                            icon={'person-outline'}
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
                        <CustomText weight='bold' size={18} color={'white'}>{loading ? 'Loading...' : 'Sign in'}</CustomText>
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
            )}
            
            
        </View>
    )
        
}