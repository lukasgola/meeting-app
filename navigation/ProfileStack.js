import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import Profile from '../screens/Profile';


const Stack = createNativeStackNavigator();

export default function ProfileStack() {

    const {colors} = useTheme();

    const navigation = useNavigation();

    return(
        <Stack.Navigator
            initialRouteName='Profile'
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
                headerTransparent: false,
                
            }}
            
        >

            <Stack.Screen 
                name='Profile' 
                component={Profile}
                options={{
                    title: 'Profile',
                }}
            />
        </Stack.Navigator>
    )
}