import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';


//Screens
import DrawerStack from './DrawerStack';
import Details from '../screens/Details';
import Map from '../screens/Map';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';


//Firebase
import { auth } from '../firebase/firebase-config';
import { onAuthStateChanged } from "firebase/auth";


import { PracticeProvider, PracticeContext } from '../contextAPI/ContextAPI';





const Stack = createNativeStackNavigator();

export default function AppStack() {

    const {colors} = useTheme();

    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if(user) setIsUser(true)
        else setIsUser(false)
        })
    }, [])

    if(isUser){
        return(
            <PracticeProvider>
                <Stack.Navigator
                    initialRouteName='DrawerStack'
                    screenOptions={{
                        headerTintColor: colors.primary,
                        headerStyle:{
                            backgroundColor: colors.background
                        },
                        headerShown: false
                    }}
                >
        
                    <Stack.Screen 
                        name='DrawerStack' 
                        component={DrawerStack}/>
                    <Stack.Screen 
                        name='Details' 
                        component={Details} 
                        options={{
                            headerShown: true,
                            headerTitle: () => <CustomText weight='bold' size={16}>Details</CustomText>
                        }}
                    />
                    <Stack.Screen 
                        name='Map' 
                        component={Map} 
                        options={{
                            headerShown: true,
                            headerTitle: () => <CustomText weight='bold' size={16}>Map</CustomText>
                        }}
                    />
                    
                </Stack.Navigator>
            </PracticeProvider>
        )

    }else {
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


    
}