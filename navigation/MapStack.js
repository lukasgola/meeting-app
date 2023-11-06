import 'react-native-gesture-handler';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';

//Screens
import Map from '../screens/Map';
import Details from '../screens/Details';

const Stack = createNativeStackNavigator();

export default function MapStack() {

    const {colors} = useTheme();

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
                name='Map' 
                component={Map}
            />
            <Stack.Screen 
                name='Details' 
                component={Details}
            />
        </Stack.Navigator>
    )
}