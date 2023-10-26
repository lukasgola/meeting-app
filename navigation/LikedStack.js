import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import Liked from '../screens/Liked';


const Stack = createNativeStackNavigator();

export default function LikedStack() {

    const {colors} = useTheme();

    const navigation = useNavigation();

    const toggleDrawer = () => {
        navigation.toggleDrawer();
    };


    return(
        <Stack.Navigator
            initialRouteName='Liked'
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
                name='Liked' 
                component={Liked}
                options={{
                    title: 'Liked',
                    headerLeft: () =>   <TouchableOpacity onPress={toggleDrawer}>
                                            <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                  
                }}
            />
        </Stack.Navigator>
    )
}