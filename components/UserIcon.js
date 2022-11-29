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
        <Image style={{
            position: 'absolute',
            width: props.size*0.85,
            height: props.size*0.85,
            borderRadius: props.size/2,
        }} source={{ uri: props.avatar ||  'https://firebasestorage.googleapis.com/v0/b/brynol-app.appspot.com/o/default-user-icon-4.jpg?alt=media&token=7f3c246c-5414-481d-a8a2-a2a6f3f4e5ab' }} />
    </View>
  );
}

export default UserIcon;