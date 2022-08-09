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
import ConfirmEmail from '../screens/ConfimEmail';
import ForgotPassword from '../screens/ForgotPassword';

import { Auth, Hub } from 'aws-amplify';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppStack({navigation}) {

    const {colors} = useTheme();

    const [user, setUser] = useState(undefined)

    const checkUser = async () => {
        try {
            const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
            setUser(authUser);
        }
        catch (e){
            setUser(null);
        }
        
    }

    useEffect(() => {
        checkUser();
    }, [])

    useEffect(() => {
        const listener = data => {
            console.log(data)
            if(data.payload.event === 'signIn' || data.payload.event === 'signOut'){
                checkUser();
            }
        }

        Hub.listen('auth', listener);
        return () => Hub.remove('auth', listener)
    })

    if(user === undefined){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <ActivityIndicator />
            </View>
        )
    }
    

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
            {user ? (
                <>
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
                </>) : (
                <>
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
                        name='ConfirmEmail' 
                        component={ConfirmEmail} 
                        options={{
                            headerTitle: () => <CustomText weight='bold' size={16}>Confirm Email</CustomText>
                        }}
                    />
                    <Stack.Screen 
                        name='ForgotPassword' 
                        component={ForgotPassword} 
                        options={{
                            headerTitle: () => <CustomText weight='bold' size={16}>Forgot Password</CustomText>
                        }}
                    />
                </>
            )}
                
        </Stack.Navigator>
    )
}