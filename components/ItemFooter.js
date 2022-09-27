import React, {useState} from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Components
import CustomText from './CustomText';

import Ionicons from 'react-native-vector-icons/Ionicons';



const ItemFooter = ({item}) => {

    const width = Dimensions.get('window').width;
    
    const {colors} = useTheme();
    const navigation = useNavigation();

    const [like, setLike] = useState(false)

    const onClickLike = () => {
        if(like) setLike(false)
        else setLike(true)
    }

    return(
        <View style={[styles.card_footer, {borderTopWidth: 1, borderColor: colors.grey_l}]}>
            <View style={styles.card_footer_half}>
                <View style={[styles.card_footer_half_content]}>
                    <Ionicons style={{marginRight: 5}} name={item.actGuests == item.maxGuests ? 'people' : 'people-outline'} size={20} color={colors.primary} />
                    <CustomText weight='bold' color={colors.text} size={15}>{item.actGuests}/{item.maxGuests}</CustomText>
                </View>
            </View>
            <View style={styles.card_footer_half}>
                <TouchableOpacity 
                    onPress={() => onClickLike() }
                    style={[styles.card_footer_half_content, {zIndex: 1}]}>
                    <Ionicons style={{marginRight: 5}} name={like ? 'heart' : 'heart-outline'} size={20} color={like ? colors.primary : colors.grey_d } />
                    <CustomText weight='bold' color={like ? colors.text : colors.grey_d} size={15}>{item.likes}</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ItemFooter;

const styles = StyleSheet.create({
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