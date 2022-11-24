import React, {useState} from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';

//Components
import CardItem from '../components/CardItem';
import ItemFooter from './ItemFooter';

import { useNavigation } from '@react-navigation/native';


const FlatListItem = ({item, location}) => {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation()

    

    const onClickParty = (item) => {
        navigation.navigate('Details', {item})
    }

  return (
    <TouchableOpacity onPress={() => onClickParty(item)}>
        <View style={[styles.card, {width: 0.9*width, backgroundColor: colors.background}]}>

            <CardItem item={item} location={location} />         
            <ItemFooter item={item} />
            
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