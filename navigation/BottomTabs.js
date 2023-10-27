import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import LikedStack from './LikedStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    const {colors} = useTheme();

    const Item = (props) => {
        return(
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Ionicons name={props.focused ? props.filled : props.icon} size={25} color={props.focused ? colors.primary : colors.grey} />
                <CustomText size={10} color={props.focused ? colors.text : colors.grey}>{props.title}</CustomText>
            </View>
        )
    }


    return(
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: colors.grey,
                tabBarActiveTintColor: colors.primary,
                tabBarStyle:{
                    backgroundColor: colors.background,
                }
            }}
            
        >
            <Tab.Screen name='HomeStack' component={HomeStack} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='home-outline' filled='home' title='Home' />
                )
            }}
            />
            <Tab.Screen name='SearchStack' component={SearchStack} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='search-outline' filled='search' title='Search' />
                )
            }}

            />
            <Tab.Screen name='LikedStack' component={LikedStack} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='heart-outline' filled='heart' title='Liked' />
                )
            }}
            />
        </Tab.Navigator>
    );
}


export default BottomTabs;