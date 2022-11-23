import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Switch, TouchableOpacity } from "react-native-gesture-handler";

import {useTheme} from '../theme/ThemeProvider';

import { useCurrentUser } from '../currentUser/CurrentUserProvider'

//Components
import CustomText from "./CustomText";
import UserIcon from "./UserIcon";

//Firebase
import { auth } from '../firebase/firebase-config';
import { signOut } from "firebase/auth";


import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";


const CustomDrawer = (props) => {

    const {colors, setScheme, isDark} = useTheme();

    const navigation = useNavigation();

    const { currentUser, setCurrentUser } = useCurrentUser();



    const [isLoaded, setIsLoaded] = useState(false);
    

    const toggleScheme = () => {
        isDark ? setScheme('light') : setScheme('dark');
    }

    const onSignOut = () => {
        //setIsLoaded(true)

        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
        
        <View style={[styles.container, {backgroundColor: colors.background} ]}>
        {isLoaded ? (
            <ActivityIndicator />
        ):(
            <DrawerContentScrollView {...props}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('MyProfile')}
                    style={styles.profile}>
                    <UserIcon size={50} photo={currentUser.avatar} score={currentUser.score} />
                    <View style={styles.name}>
                        <CustomText color={colors.text} weight='bold' size={14} style={styles.name}>{currentUser.username}</CustomText>
                        <CustomText color={colors.text} size={12} style={styles.name}>{currentUser.email}</CustomText>
                    </View>
                    
                </TouchableOpacity>
                
                <View>
                    <DrawerItemList {...props}/>
                </View>
                <View style={styles.darkMode}>
                    <View style={styles.darkModeTitle}>
                        <Ionicons style={{marginRight: 20}} name='cloudy-night-outline' size={22} color={colors.text} />
                        <CustomText
                            weight='bold'
                            color={colors.text}
                            size={15}
                        >Dark Mode</CustomText>
                    </View>
                    
                    <Switch
                        trackColor={{ true: colors.primary, false: "#DDDDDD" }}
                        thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
                        onValueChange={toggleScheme}
                        value={isDark}
                    />
                </View>
                <TouchableOpacity 
                    onPress={onSignOut}
                    style={styles.darkMode}>
                    <View style={styles.darkModeTitle}>
                        <Ionicons style={{marginRight: 20}} name='log-out-outline' size={22} color={colors.text} />
                        <CustomText
                            weight='bold'
                            color={colors.text}
                            size={15}
                        >Sign Out</CustomText>
                    </View>
                </TouchableOpacity>
            </DrawerContentScrollView>
        )}
            
        </View>
    )
}

export default CustomDrawer;


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    drawerHeader:{
        width: '93%',
        height: 150,
        borderRadius: 10,
        marginLeft: '3.5%',
        padding: 15,
    },
    profile:{
        padding: 15,
        flexDirection: 'row',
    },  
    name:{
        paddingLeft: 15,
        justifyContent: 'center'
    },
    image:{
        width: 50,
        height:50,
        borderRadius: 25,
    },
    darkMode: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    darkModeTitle: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})