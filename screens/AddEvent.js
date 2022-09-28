import React, {useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';

import DateTimePicker from '@react-native-community/datetimepicker';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddEvent(){

    const {colors} = useTheme();

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const [title, setTitle] = useState(null);

    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    };


    return (
            <KeyboardAvoidingView style={[styles.container, {backgroundColor: colors.background}]}>

                <View style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h1}>New</CustomText>
                    <CustomText weight='bold' color={colors.primary} size={h1}> Event</CustomText>
                </View>

                <View style={{width: '80%', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                    <CustomText align={'center'} color={colors.grey_d} size={h4}>Complete information about the event. The exact location will be made available after your approval.</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Title</CustomText>
                </View>

                <TextInput 
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.input,{backgroundColor: colors.grey_l}]}
                    placeholder={'e.g. House party'}
                    placeholderTextColor={colors.grey_d}
                    cursorColor={colors.primary}
                />

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Location</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Date</CustomText>
                </View>

                <DateTimePicker
                    mode='time'
                    value={date}
                    onChange={onChange}
                    textColor={colors.text}
                    accentColor={colors.text}
                    themeVariant='light'
                    display={'spinner'}
                    style={{
                        width: '100%',
                        height: 200,
                    }}
                />

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Indoor/Outdoor</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Guests</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Description</CustomText>
                </View>
                
            </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12
    }
})