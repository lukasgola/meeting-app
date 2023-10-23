import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

//Components
import CustomText from './CustomText';
import ItemFooter from './ItemFooter';
import UserIcon from '../components/UserIcon';

//Providers
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useCurrentLocation } from '../providers/CurrentLocationProvider';

//Locations
import {getDistance} from 'geolib';

//Firebase
import { db } from '../firebase/firebase-config';
import { doc, getDoc } from "firebase/firestore";


const FlatListItem = ({item}) => {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const {currentLocation, setCurrentLocation} = useCurrentLocation();
    const navigation = useNavigation()

    const [ user, setUser ] = useState(null);
    const [like, setLike] = useState(false)

    const onClickParty = (item) => {
        navigation.navigate('Details', {item})
    }

    const calculateDistance = (latitude, longitude) => {
        var dis = getDistance(
            {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
            {latitude: latitude, longitude: longitude},
        );
        return Math.round(dis/1000);

    };

    const getUser = () => {
        getDoc(doc(db, "users", item.organizer))
        .then(docSnap => {
        if (docSnap.exists()) {
            const user = {
                ...docSnap.data()
            }
            setUser(user)
        } else {
        console.log("No such document!");
        }
        })
    }

    useEffect(() => {
      getUser();
    }, [])

  return (
    <TouchableOpacity  
        onPress={() => onClickParty(item)}
        style={[styles.card, {width: '100%', backgroundColor: colors.background}]}
    >
        <View style={styles.card_main}>
            
            <View style={styles.card_main_image_view}>
            {user ? 
                <UserIcon size={80} avatar={user.avatar} score={user.score} />
                :
                <ActivityIndicator />
            }
            </View>
            <View style={[styles.card_main_info, {width: 0.6*width}]}>
                <CustomText weight='bold' size={16} >{item.title}</CustomText>
                <View style={styles.card_main_info_row}>
                    <Ionicons style={{marginRight: 5}} name='location-outline' size={16} color={colors.text} />
                    <CustomText size={14} color={colors.grey_d} >{calculateDistance(item.latitude, item.longitude)} km from you</CustomText>
                </View>
                <View style={styles.card_main_info_row}>
                    <View style={{flexDirection: 'row', width: '40%',}}>
                        <Ionicons style={{marginRight: 5}} name='time-outline' size={16} color={colors.text} />
                        <CustomText weight='bold' size={14} color={colors.text} >{item.time_hour}:{item.time_minute == 0 ? "00" : item.time_minute }</CustomText>
                    </View>

                    <View style={{flexDirection: 'row', width: '40%',}}>
                        <Ionicons style={{marginRight: 5}} name='calendar-outline' size={16} color={colors.text} />
                        <CustomText weight='bold' size={14} color={colors.text} >{item.day}/{item.month}/{item.year}</CustomText>
                    </View>
                    
                    
                </View>
                <View style={styles.card_main_info_row}>
                    <View style={{flexDirection: 'row', width: '40%',}}>
                        <Ionicons style={{marginRight: 5}} name='cloud-outline' size={16} color={colors.text} />
                        <CustomText weight='bold' size={14} color={colors.text} >{item.place}</CustomText>
                    </View>

                    <View style={{flexDirection: 'row', width: '40%',}}>
                        <Ionicons style={{marginRight: 5}} name='checkbox-outline' size={16} color={colors.text} />
                        <CustomText weight='bold' size={14} color={colors.text} >{item.type}</CustomText>
                    </View>
                </View>
            </View>
        </View>
        
        <View style={[styles.card_footer, {borderTopWidth: 1, borderColor: colors.grey_l}]}>
            <View style={styles.card_footer_half}>
                <View style={[styles.card_footer_half_content]}>
                    <Ionicons style={{marginRight: 5}} name={item.actGuests == item.maxGuests ? 'people' : 'people-outline'} size={20} color={colors.primary} />
                    <CustomText weight='bold' color={colors.text} size={15}>{item.actGuests}/{item.maxGuests}</CustomText>
                </View>
            </View>
            <View style={styles.card_footer_half}>
                <TouchableOpacity 
                    style={[styles.card_footer_half_content, {zIndex: 1}]}>
                    <Ionicons style={{marginRight: 5}} name={like ? 'heart' : 'heart-outline'} size={20} color={like ? colors.primary : colors.grey_d } />
                    <CustomText weight='bold' color={like ? colors.text : colors.grey_d} size={15}>{item.likes}</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
  );
}

export default FlatListItem;

const styles = StyleSheet.create({
    card:{
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5.84,

        elevation: 8,
    },
    card_footer:{
        width: '100%',
        height: 50,
        flexDirection: 'row',
    },
    card_footer_half:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card_footer_half_content:{
        width: '90%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    card_main:{
        width: '100%',
        height: 100,
        flexDirection: 'row',
        marginBottom: 10
    },
    card_main_image_view:{
        width: '25%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card_main_image: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    card_main_info:{
        height: 100,
        marginLeft: 10,
    },
    card_main_info_row:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 5
    },
    card_footer:{
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingTop: 10,
    },
    card_footer_half:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card_footer_half_content:{
        width: '90%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    }
})