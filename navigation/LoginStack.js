import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';

//Screens
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';





const Stack = createNativeStackNavigator();

export default function LoginStack() {

    const {colors} = useTheme();

    
    return(
        <Stack.Navigator
            screenOptions={{
                headerTintColor: colors.primary,
                headerStyle:{
                    backgroundColor: colors.background
                },
                headerShown: false
            }}
        >
            <Stack.Screen 
                name='SignIn' 
                component={SignIn} 
                options={{
                    headerTitle: () => <CustomText weight='bold' size={16}>Sign In</CustomText>
                }}
            />
            <Stack.Screen 
                name='SignUp' 
                component={SignUp} 
                options={{
                    headerTitle: () => <CustomText weight='bold' size={16}>Sign Up</CustomText>
                }}
            />
            <Stack.Screen 
                name='ForgotPassword' 
                component={ForgotPassword} 
                options={{
                    headerTitle: () => <CustomText weight='bold' size={16}>Forgot Password</CustomText>
                }}
            />

        </Stack.Navigator>
    ) 
}