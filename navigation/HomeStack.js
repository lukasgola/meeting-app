import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
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
import AddEvent from '../screens/AddEvent';


const Stack = createNativeStackNavigator();

export default function HomeStack() {

    const {colors} = useTheme();

    const navigation = useNavigation();


    const toggleDrawer = () => {
        //Props to open/close the drawer
        navigation.toggleDrawer();
    };


    return(
        <Stack.Navigator
            initialRouteName='Home'
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
                name='Home' 
                component={Home}
                options={{
                    title: 'Home',
                    headerLeft: () =>   <TouchableOpacity onPress={toggleDrawer}>
                                            <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                                
                    headerRight: () =>  <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
                                            <Ionicons name='create-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                }}
            />
            <Stack.Screen 
                name='Details' 
                component={Details} 
            />
            <Stack.Screen 
                name='Map' 
                component={Map}
            />
            <Stack.Screen 
                name='Profile' 
                component={Profile} 
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
                    title: 'Add Event',
                }}
            />
            
        </Stack.Navigator>
    )
}