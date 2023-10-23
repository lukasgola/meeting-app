import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';

//Providers
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Search(){


    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation()
    

    return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
            }}>

                <CustomText>Liked</CustomText> 
                
            </View>
    );
}
