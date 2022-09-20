import 'react-native-gesture-handler';
import React from 'react';
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
import AddEvent from '../screens/AddEvent';


const Stack = createNativeStackNavigator();

export default function AppStack() {

    const {colors} = useTheme();


    return(
        <Stack.Navigator
            screenOptions={{
                headerTintColor: colors.primary,
                headerStyle:{
                    backgroundColor: colors.background,
                    alignItems: 'center'
                },
                headerTitleStyle: {
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    color: colors.text
                },
                headerShown: false,
            }}
            
        >

            <Stack.Screen 
                name='DrawerStack' 
                component={DrawerStack}/>
            <Stack.Screen 
                name='Details' 
                component={Details} 
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen 
                name='Map' 
                component={Map} 
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Profile' 
                component={Profile} 
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='EditProfile' 
                component={EditProfile} 
                options={{
                    headerShown: true,
                    title: 'Edit Profile'
                }}
            />
            <Stack.Screen 
                name='AddEvent' 
                component={AddEvent} 
                options={{
                    headerShown: true,
                    title: 'Add Event',
                }}
            />
            
        </Stack.Navigator>
    )
}