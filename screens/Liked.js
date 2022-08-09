import React, {useState} from 'react';
import {View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';

import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';

import Ionicons from 'react-native-vector-icons/Ionicons';


import parties from '../data/parties';
import meetings from '../data/meetings';


export default function Search({navigation}){


    const width = Dimensions.get('window').width;

    const {colors} = useTheme();


    const CATEGORIES = [
        {
            id: 1,
            title: 'Parties',
            icon: 'beer-outline'
        },
        {
            id: 2,
            title: 'Meetings',
            icon: 'people-outline'
        },
        {
            id: 3,
            title: 'Transport',
            icon: 'car-outline'
        },
        {
            id: 4,
            
            title: 'Games',
            icon: 'american-football-outline'
        },
        {
            id: 5,
            title: 'Others',
            icon: 'earth-outline'
        },
    ]



    const renderFlatlist = (data) => {
        return(
            <FlatList
                data={data}
                renderItem={({item}) => <FlatListItem item={item} navigation={navigation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{ width: '100%', marginVertical: 20 }}>
                        <View style={{ marginLeft: 0.05*width }}>
                            <View style={{ width: 0.9*width }}>
                                <CustomText weight='bold' size={20}>Parties</CustomText>
                            </View>
                            <CustomText size={14} color={colors.grey_d}>110 results found</CustomText>
                        </View>
                    </View>
                }
            />
        ) 
    }
    

    return (
            <View style={{
                flex: 1,
                backgroundColor: colors.background,
            }}>

                {renderFlatlist(parties)}
                
            </View>
    );
}
