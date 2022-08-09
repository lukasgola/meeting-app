import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator();

import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomText from '../components/CustomText';

import CustomDrawerHeader from '../components/CustomDrawerHeader';

import Main from '../screens/Main';
import Search from '../screens/Search';
import Liked from '../screens/Liked';
import Chats from '../screens/Chats';

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
                headerShown: true,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: colors.grey,
                tabBarActiveTintColor: colors.primary,
                tabBarStyle:{
                    backgroundColor: colors.background,
                }
            }}
            
        >
            <Tab.Screen name='Main' component={Main} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='home-outline' filled='home' title='Home' />
                ),
                header: (props) => (
                    <CustomDrawerHeader {...props} name='Home' />
                ),
            }}

            />
            <Tab.Screen name='Search' component={Search} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='search-outline' filled='search' title='Search' />
                ),
                header: (props) => (
                    <CustomDrawerHeader {...props} name='Search' />
                ),
            }}

            />
            <Tab.Screen name='Liked' component={Liked} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='heart-outline' filled='heart' title='Liked' />
                ),
                header: (props) => (
                    <CustomDrawerHeader {...props} name='Liked' />
                ),
            }}

            />
            <Tab.Screen name='Chats' component={Chats} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='chatbubbles-outline' filled='chatbubbles' title='Chats' />
                ),
                header: (props) => (
                    <CustomDrawerHeader {...props} name='Chats' />
                ),
            }}
            />
        </Tab.Navigator>
    );
}


export default BottomTabs;