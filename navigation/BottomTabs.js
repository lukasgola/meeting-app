import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Liked from '../screens/Liked';
import Chats from '../screens/Chats';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    const {colors} = useTheme();

    const navigation = useNavigation();


    const toggleDrawer = () => {
        //Props to open/close the drawer
        navigation.toggleDrawer();
    };
    

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
                },
                headerLeft: () =>   <TouchableOpacity style={{marginLeft: 15}} onPress={toggleDrawer}>
                                        <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                                    </TouchableOpacity>,
                                
                headerRight: () =>  <TouchableOpacity style={{marginRight: 15}} onPress={() => navigation.navigate('AddEvent')}>
                                        <Ionicons name='add-circle-outline' size={25} color={colors.primary}/>
                                    </TouchableOpacity>,
                headerTitleStyle: {
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    color: colors.text
                },
            }}
            
        >
            <Tab.Screen name='Home' component={Home} options={{
                tabBarIcon: ({focused}) => (
                    <Item focused={focused} icon='home-outline' filled='home' title='Home' />
                ),
                title: 'Home'
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