import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';

import { Auth } from 'aws-amplify';

import {useForm} from 'react-hook-form';


export default function SignUp({navigation}){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();


    const [loading, setLoading] = useState(false);


    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    const {control, handleSubmit, watch} = useForm();

    const pwd = watch('password');

    const onRegister = async data => {

        const {username, password, email} = data;

        if(loading){
            return;
        }
        setLoading(true);
        try {
            const { user } = await Auth.signUp({
            username,
            password,
            attributes: {email, preferred_username: username},
        });
            
        navigation.navigate('ConfirmEmail', {username})

        } catch (error) {
            Alert.alert('error signing up:', error.message);
        }
        setLoading(false);
    };

    const onTerms = () => {
        
    }

    const onPolicy = () => {

    }

    const onSignIn = () => {
        navigation.navigate('SignIn')
    }



    return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
                <View style={{ width: 0.9*width }}>
                    <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <CustomText weight='bold' size={30}>Create an account</CustomText>
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
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <CustomInput
                            name="password-repeat"
                            placeholder="Reapeat Password"
                            secureTextEntry
                            control={control}
                            rules={{
                                validate: value => value === pwd || 'Password do not match',
                            }}
                            size={12} 
                            color={colors.grey_l} 
                            icon={'lock-closed-outline'}
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleSubmit(onRegister)}
                        style={{ 
                            width: '100%', 
                            height: 50, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            marginTop: 20,
                            borderRadius: 10,
                            backgroundColor: colors.primary
                        }}>
                        <CustomText weight='bold' size={18} color={'white'}>{loading ? 'Loading...' : 'Register'}</CustomText>
                    </TouchableOpacity>
                    <View 
                        style={{ width: '100%', marginTop: 10, flexWrap:'wrap', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <CustomText color={colors.grey_d}>By registering you confirm that you accept our </CustomText>
                        <TouchableOpacity
                            onPress={onTerms}
                        >
                            <CustomText color={colors.primary}>Terms of Use </CustomText>
                        </TouchableOpacity>
                        <CustomText color={colors.grey_d}>and </CustomText>
                        <TouchableOpacity
                            onPress={onPolicy}
                        >
                            <CustomText color={colors.primary}>Privacy Policy</CustomText>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={onSignIn}
                        style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                        <CustomText color={colors.grey_d}>Have an account?</CustomText>
                        <CustomText color={colors.primary}>  Sign in!</CustomText>
                    </TouchableOpacity>
                    
                </View>
                
            </View>
    );
}