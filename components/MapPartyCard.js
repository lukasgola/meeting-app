import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Modal, KeyboardAvoidingView, Text, TouchableOpacity, Animated, Pressable } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import * as Haptics from 'expo-haptics';

import {useTheme} from '../theme/ThemeProvider';

import FlatListItem from './FlatListItem';

const MapPartyCard = (props) => {


    const leftValue = useState(new Animated.Value(-500))[0];

    const {colors} = useTheme();

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



    return (
        <Animated.View style={{
            width: '95%',
            position: 'absolute',
            bottom: leftValue,
        }}>
            <TouchableOpacity 
                onPress={() => slideOut()}
                style={{position: 'absolute', width: 40, height: 40, zIndex: 1, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name='close-outline' size={30} color={colors.text} />
            </TouchableOpacity>
            <FlatListItem item={props.item} />
        </Animated.View>
    );
}

export default MapPartyCard;