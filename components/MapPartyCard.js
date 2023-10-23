//miganie
//cancel button

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Modal, KeyboardAvoidingView, Text, TouchableOpacity, Animated, Pressable } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import * as Haptics from 'expo-haptics';

import { useCurrentLocation } from '../providers/CurrentLocationProvider';

import {useTheme} from '../theme/ThemeProvider';

import FlatListItem from './FlatListItem';
import CustomText from './CustomText';

import redirectToMaps from '../functions/redirectToMaps';

const MapPartyCard = (props) => {


    const leftValue = useState(new Animated.Value(-500))[0];

    const {colors} = useTheme();
    const {currentLocation} = useCurrentLocation();

    function slideIn(){
        Animated.spring(leftValue,{
            toValue: 20,
            duration: 400,
            useNativeDriver: false
        }).start()
    }

    const firstUpdate = useRef(false);

    function slideOut(){
        Animated.spring(leftValue,{
            toValue: -1000,
            duration: 500,
            useNativeDriver: false
        }).start()

        setTimeout(() => {
            props.onCancel();
        }, 100)
    }
    
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = true;
        }
        else {
            if(props.visible){
                slideIn();
                firstUpdate.current = true;
            }
        }
    });


    const handleRedirectToMaps = (destLat, destLng) => {
        const data = {
           source: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          },
          destination: {
            latitude: destLat,
            longitude: destLng
          },
          params: [
            {
              key: "travelmode",
              value: "transit"        // may be "walking", "bicycling" or "transit" as well
            }
          ]
        }
        redirectToMaps(data)
      }

    return (
        <Animated.View 
            style={{
                width: '95%',
                position: 'absolute',
                bottom: leftValue,
                marginLeft: '2.5%'
            }}
        >
            {props.route !== null ? 
                <View style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: colors.background,
                    borderRadius: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20
                }}>
                    <View style={{flexDirection: 'row'}}>
                        <CustomText weight='bold' color={colors.primary}>{(props.route.duration).toFixed(0) + ' min '} </CustomText>
                        <CustomText>{(props.route.distance).toFixed(0) + ' km '}</CustomText>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleRedirectToMaps(props.item.latitude, props.item.longitude)}
                    >
                        <Ionicons name='navigate-outline' size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
                :
                <View>

                </View>
            }
            <FlatListItem item={props.item} />

            <TouchableOpacity 
                onPress={() => slideOut()}
                style={{width: '100%', height: 50, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: -10, marginBottom: 10}}>
                <CustomText size={18}>Cancel</CustomText>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default MapPartyCard;