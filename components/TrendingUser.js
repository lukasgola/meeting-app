import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import CustomText from './CustomText';
import UserIcon from '../components/UserIcon';


const TrendingUser = ({item}) => {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation();

    const onClickUser = (item) => {
        navigation.navigate('Profile', {currentUser: item})
    }


    return(
        <TouchableOpacity style={{marginLeft: 0.05*width}} onPress={() => onClickUser(item)}>
            <View style={[styles.card,{width: 120, height: 140, backgroundColor: colors.background, alignItems: 'center'}]}>
                <View style={{width: 80, height: 60, alignItems: 'center', justifyContent: 'center'}}>
                    <UserIcon size={60} photo={item.avatar} score={item.score} />
                </View>
                <View style={{width: 80, height: 30, alignItems: 'center', justifyContent: 'center'}}>
                    <CustomText  weight='bold' color={colors.text}>{item.username}</CustomText>
                </View>
                <TouchableOpacity
                    style={{
                        width: 100, 
                        height: 30, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: colors.primary,
                        borderRadius: 10
                    }}>
                    <CustomText weight='bold' color='white'>Follow</CustomText>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default TrendingUser;

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
    }
})