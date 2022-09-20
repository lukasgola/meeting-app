import React from 'react';
import { TouchableOpacity } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';

//Components
import CustomDrawer from '../components/CustomDrawer'

import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import BottomTabs from './BottomTabs';
import Settings from '../screens/Settings';


const Drawer = createDrawerNavigator();

export default function DrawerStack(){

    const {colors} = useTheme();

    const navigation = useNavigation()

    // const toggleDrawer = () => {
    //     //Props to open/close the drawer
    //     navigation.toggleDrawer();
    // };


    return (
            <Drawer.Navigator 
            initialRouteName='BottomTabs' 
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: colors.background
                },
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    color: colors.text,
                },
                headerTitleAlign: 'center',
                drawerActiveBackgroundColor: colors.primary,
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: colors.text,
                drawerLabelStyle:{
                    marginLeft: -10,
                    fontSize: 15,
                    fontFamily: 'Montserrat-Bold'
                },
                headerLeft: () =>   <TouchableOpacity style={{marginLeft: 15}} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                                        <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                                    </TouchableOpacity>,
            }}
            >
                <Drawer.Screen name='BottomTabs' component={BottomTabs} options={{
                    drawerIcon: ({color}) => (
                    <Ionicons name='home-outline' size={22} color={color} />
                    ),
                    title: 'Home'
                }}
                />
                <Drawer.Screen name='Settings' component={Settings} options={{
                    drawerIcon: ({color}) => (
                    <Ionicons name='settings-outline' size={22} color={color} />
                    ),
                    headerShown: true
                }} />
            </Drawer.Navigator>
    );
}