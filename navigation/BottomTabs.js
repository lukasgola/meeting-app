import { View, TouchableOpacity, StatusBar } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useCurrentUser } from '../providers/CurrentUserProvider';

import CustomText from '../components/CustomText';
import UserIcon from '../components/UserIcon';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import ProfileStack from './ProfileStack';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const BottomTabs = () => {

    const {colors} = useTheme();
    const { currentUser } = useCurrentUser()

    const ProfileItem = (props) => {
        return(
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
            }}>
                <UserIcon size={30} avatar={currentUser.avatar} score={currentUser.score} />
            </View>
        )
    }
    const Item = (props) => {
        return(
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
            }}>
                <Ionicons name={props.focused ? props.filled : props.icon} size={25} color={props.focused ? colors.primary : colors.grey} />
            </View>
        )
    }



    return(
        <Tab.Navigator
            initialRouteName='HomeStack'
            tabBarPosition='bottom'
            screenOptions={{
                tabBarStyle: {
                backgroundColor: colors.background,
                height: 70,
                },
                tabBarShowLabel: false,
                tabBarIconStyle: {
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5
                },
                tabBarIndicatorStyle:{
                position: 'absolute',
                top: 0,
                backgroundColor: colors.primary
                },
                swipeEnabled: false,
                
            }}

            
        >
            <Tab.Screen name='HomeStack' component={HomeStack} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='home-outline' filled='home' title='Home' />
                ),
                
            }}
            />

            <Tab.Screen name='SearchStack' component={SearchStack} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='search-outline' filled='search' title='Search' />
                ),
                
            }}

            />
            <Tab.Screen name='ProfileStack' component={ProfileStack} options={{
                tabBarIcon: ({focused}) => (
                    <ProfileItem focused={focused} icon='heart-outline' filled='heart' title='Profile' />
                ),
                tabBarLabel: ''
            }}
            />
        </Tab.Navigator>
    );
}


export default BottomTabs;