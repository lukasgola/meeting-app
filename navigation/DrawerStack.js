import React from 'react';
import {useTheme} from '../theme/ThemeProvider';
import { createDrawerNavigator } from '@react-navigation/drawer';


import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import BottomTabs from './BottomTabs';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';

//Components
import CustomDrawer from '../components/CustomDrawer'

import CustomDrawerHeader from '../components/CustomDrawerHeader';

const Drawer = createDrawerNavigator();

export default function Home({navigation}){

    const {colors} = useTheme();

    return (
            <Drawer.Navigator 
            initialRouteName='Home' 
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: colors.background
                },
                headerTintColor: colors.primary,
                headerTitleStyle:{
                  color: colors.text
                },
                drawerActiveBackgroundColor: colors.primary,
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: colors.text,
                drawerLabelStyle:{
                    marginLeft: -10,
                    fontSize: 15,
                    fontFamily: 'Montserrat-Bold'
                }
            }}
            >
                <Drawer.Screen name='Home' component={BottomTabs} options={{
                    drawerIcon: ({color}) => (
                    <Ionicons name='home-outline' size={22} color={color} />
                    )
                }}
                />
                <Drawer.Screen name='Profile' component={Profile} options={{
                    drawerIcon: ({color}) => (
                    <Ionicons name='person-outline' size={22} color={color} />
                    ),
                    headerShown: true,
                    header: (props) => (
                        <CustomDrawerHeader {...props} name='Profile' />
                    ),
                }} />
                <Drawer.Screen name='Settings' component={Settings} options={{
                    drawerIcon: ({color}) => (
                    <Ionicons name='settings-outline' size={22} color={color} />
                    ),
                    headerShown: true,
                    header: (props) => (
                        <CustomDrawerHeader {...props} name='Settings' />
                    ),
                }} />
            </Drawer.Navigator>
    );
}