import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Liked from '../screens/Liked';
import Chats from '../screens/Chats';

import HomeStack from './HomeStack';


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
            <Tab.Screen name='Search' component={Search} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='search-outline' filled='search' title='Search' />
                )
            }}

            />
            <Tab.Screen name='Liked' component={Liked} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='heart-outline' filled='heart' title='Liked' />
                )
            }}
            />
            <Tab.Screen name='Chats' component={Chats} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='chatbubbles-outline' filled='chatbubbles' title='Chats' />
                )
            }}
            />
        </Tab.Navigator>
    );
}


export default BottomTabs;