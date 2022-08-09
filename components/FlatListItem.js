import React, {useState} from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from './CustomText';
import CardItem from '../components/CardItem';

import Ionicons from 'react-native-vector-icons/Ionicons';


const FlatListItem = ({item,navigation, user, location}) => {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    

    const onClickParty = (item) => {
        navigation.navigate('Details', {item})
    }

    const [like, setLike] = useState(false)

    const onClickLike = () => {
        if(like) setLike(false)
        else setLike(true)
    }

    


  return (
    <TouchableOpacity style={{marginLeft: 0.05*width}} onPress={() => onClickParty(item)}>
        <View style={[styles.card, {width: 0.9*width, backgroundColor: colors.grey_l}]}>

            <CardItem item={item} user={user} location={location} />
            
            <View style={styles.card_footer}>
                <View style={styles.card_footer_half}>
                    <View style={[styles.card_footer_half_content, {backgroundColor: colors.background}]}>
                        <Ionicons style={{marginRight: 5}} name='people' size={20} color={colors.primary} />
                        <CustomText weight='bold' color={colors.text} size={15}>{item.actGuests}/{item.maxGuests}</CustomText>
                    </View>
                </View>
                <View style={styles.card_footer_half}>
                    <TouchableOpacity 
                        onPress={() => onClickLike() }
                        style={[styles.card_footer_half_content, {zIndex: 1, backgroundColor: colors.background}]}>
                        <Ionicons style={{marginRight: 5}} name={like ? 'heart' : 'heart-outline'} size={20} color={like ? colors.secondary : colors.grey_d } />
                        <CustomText weight='bold' color={like ? colors.secondary : colors.grey_d} size={15}>{item.likes}</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );
}

export default FlatListItem;

const styles = StyleSheet.create({
    card:{
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 2.84,

        elevation: 6,
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