import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import Home from '../screens/Home';
import Details from '../screens/Details';
import Map from '../screens/Map';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import Search from '../screens/Search';


const Stack = createNativeStackNavigator();

export default function SearchStack() {

    const {colors} = useTheme();

    const navigation = useNavigation();

    const toggleDrawer = () => {
        //Props to open/close the drawer
        navigation.toggleDrawer();
    };


    return(
        <Stack.Navigator
            initialRouteName='Search'
            screenOptions={{
                headerShown: true,
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
                animation: 'slide_from_bottom',
                presentation: 'modal'
            }}
            
        >

            <Stack.Screen 
                name='Search' 
                component={Search}
                options={{
                    title: 'Search',
                    headerLeft: () =>   <TouchableOpacity onPress={toggleDrawer}>
                                            <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                                
                    headerRight: () =>  <TouchableOpacity>
                                            <Ionicons name='options-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                }}
            />
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
            
        </Stack.Navigator>
    )
}