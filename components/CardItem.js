import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';

//Components
import UserIcon from '../components/UserIcon';
import CustomText from './CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';

//Locations
import {getDistance} from 'geolib';
    

const CardItem = ({item, location}) => {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const calculateDistance = (latitude, longitude) => {
        var dis = getDistance(
            {latitude: location.latitude, longitude: location.longitude},
            {latitude: latitude, longitude: longitude},
        );
        return Math.round(dis/1000);
    };

    return(
        <View style={styles.card_main}>
            <View style={styles.card_main_image_view}>
                <UserIcon size={80} photo={item.organizer.avatar} score={item.organizer.score} />
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
                        <CustomText weight='bold' size={14} color={colors.text} >{item.time_hour}:{item.time_minute}</CustomText>
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
    )
}



export default CardItem;


const styles = StyleSheet.create({
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
})