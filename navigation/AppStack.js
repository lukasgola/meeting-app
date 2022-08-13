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
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';


const Stack = createNativeStackNavigator();

export default function AppStack() {

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
            <Stack.Screen 
                name='Profile' 
                component={Profile} 
                options={{
                    headerShown: true,
                    headerTitle: () => <CustomText weight='bold' size={16}>Profile</CustomText>
                }}
            />
            <Stack.Screen 
                name='EditProfile' 
                component={EditProfile} 
                options={{
                    headerShown: true,
                    headerTitle: () => <CustomText weight='bold' size={16}>Edit Profile</CustomText>
                }}
            />
            
        </Stack.Navigator>
    )
}