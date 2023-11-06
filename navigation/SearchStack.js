import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import Search from '../screens/Search';


const Stack = createNativeStackNavigator();

export default function SearchStack() {

    const {colors} = useTheme();
    const navigation = useNavigation();
    
    return(
        <Stack.Navigator
            initialRouteName='Search'
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
                headerTransparent: false,
                
            }}
            
        >

            <Stack.Screen 
                name='Search' 
                component={Search}
                options={{
                    title: 'Search',
                                
                    headerRight: () =>  
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Map')}
                        >
                            <Ionicons name='options-outline' size={25} color={colors.primary}/>
                        </TouchableOpacity>
                  
                }}
            />
            
        </Stack.Navigator>
    )
}