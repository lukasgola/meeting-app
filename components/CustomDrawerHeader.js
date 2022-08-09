import React from 'react';
import {View, Dimensions, StatusBar, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Constants from 'expo-constants';

const DrawerHeader = (props) => {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {colors} = useTheme();

        //Structure for the navigatin Drawer
    const toggleDrawer = () => {
        //Props to open/close the drawer
        props.navigation.toggleDrawer();
        
    };

    return (
        <View style={{backgroundColor: colors.background}}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <View style={{flex: 1, height: Platform.OS === 'ios' ? height : height - Constants.statusBarHeight, marginTop: Constants.statusBarHeight}}></View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: '4%',
                    paddingVertical: 8
                }}
            >
                <TouchableOpacity onPress={toggleDrawer}>
                    <Ionicons name='menu-outline' size={25} color={colors.primary}/>
                </TouchableOpacity>
                <CustomText weight='bold' size={16}>{props.name}</CustomText>
                <TouchableOpacity onPress={() => props.navigation.navigate('Map')}>
                    <Ionicons name='cube-outline' size={25} color={colors.primary}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DrawerHeader;