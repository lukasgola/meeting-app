import React , { useState, useEffect } from 'react';
import { View, Image } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';

import CircularProgress from 'react-native-circular-progress-indicator';


const UserIcon = (props) => {

    const {colors} = useTheme();


  return (
    
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <CircularProgress
            activeStrokeColor={colors.primary}
            //activeStrokeSecondaryColor={colors.secondary}
            activeStrokeWidth={props.size/25}
            inActiveStrokeColor={null}
            inActiveStrokeWidth={props.size/25}
            value={props.score}
            radius={props.size/2}
            duration={0}
            progressValueColor={colors.text}
            maxValue={5}
            showProgressValue={false}
            // progressFormatter={(value) => {
            //     'worklet';
                
            //     return value // 2 decimal places
            // }}
        />
        <Image 
            style={{
                position: 'absolute',
                width: props.size*0.85,
                height: props.size*0.85,
                borderRadius: props.size/2,
            }}
            source={props.avatar ? {uri: props.avatar} : require('../assets/images/default-user-icon-4.jpg')} 
         />
    </View>
  );
}

export default UserIcon;