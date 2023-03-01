import React, {useState} from 'react';
import {View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../components/CustomText';

import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';

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
