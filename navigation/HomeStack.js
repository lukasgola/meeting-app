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


const Stack = createNativeStackNavigator();

export default function HomeStack() {

    const {colors} = useTheme();
    const navigation = useNavigation();

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
                                
                    headerRight: () =>  <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
                                            <Ionicons name='create-outline' size={25} color={colors.primary}/>
                                        </TouchableOpacity>,
                }}
            />
            
        </Stack.Navigator>
    )
}