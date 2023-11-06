import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Screens
import Details from '../screens/Details';
import Map from '../screens/Map';
import MyProfile from '../screens/MyProfile';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import AddEvent from '../screens/AddEvent';
import Avatar from '../screens/Avatar';
import QuickAction from '../screens/QuickAction';

import BottomTabs from './BottomTabs';


const Stack = createNativeStackNavigator();

export default function MainStack() {

    const {colors} = useTheme();

    const navigation = useNavigation();

    return(
        <Stack.Navigator
            initialRouteName='BottomTabs'
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: colors.primary,
                headerStyle:{
                    backgroundColor: colors.background,
                },
                headerTitleStyle: {
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    color: colors.text,
                },
                headerTitleAlign: 'center',
                
            }}
        >

            <Stack.Screen 
                name='BottomTabs' 
                component={BottomTabs}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Avatar' 
                component={Avatar}
            />
            <Stack.Screen 
                name='Details' 
                component={Details}
            />
            <Stack.Screen 
                name='Map' 
                component={Map}
                options={{
                    title: 'Home',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen 
                name='MyProfile' 
                component={MyProfile} 
                options={{
                    title: 'Your Profile',
                }}
            />
            <Stack.Screen 
                name='Profile' 
                component={Profile} 
                options={{
                    title: 'Profile',
                }}
            />
            <Stack.Screen 
                name='EditProfile' 
                component={EditProfile} 
                options={{
                    title: 'Edit Profile'
                }}
            />
            <Stack.Screen 
                name='AddEvent' 
                component={AddEvent} 
                options={{
                    title: '',
                }}
            />
            <Stack.Screen 
                name='QuickAction' 
                component={QuickAction} 
                options={{
                    title: '',
                }}
            />
            
        </Stack.Navigator>
    )
}