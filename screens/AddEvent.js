import React, {useState, useEffect} from 'react';
import {View, Modal, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import Geocoder from 'react-native-geocoding';
import * as Location from "expo-location"

import CustomText from '../components/CustomText';

import CustomInput from '../components/CustomInput';

import {useForm, Controller} from 'react-hook-form';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddEvent(){

    Geocoder.init("AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE");

    const height = Dimensions.get('window').height;

    const {colors} = useTheme();

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const [title, setTitle] = useState(null);

    const [date, setDate] = useState(new Date());
    const [dateString, setDateString] = useState('Select date')

    const [time, setTime] = useState(new Date())
    const [timeString, setTimeString] = useState('Select time')

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        setTime(time)
        setTimeString(time.getHours() + ':' + time.getMinutes())
        hideTimePicker();
    };



    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date)
        setDateString(date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear())
        hideDatePicker();
    };


    const { control, handleSubmit, formState: {errors} } = useForm();

    const onSignIn = async data => {
        const { title, date, time} = data;
        console.log(title);
        console.log(date);
        console.log(time);
    };

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);

    const [address, setAddress] = useState(null);
    const [isAddress, setIsAddress] = useState(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setIsLocation(true)

        Geocoder.from(location.coords.latitude, location.coords.longitude)
		.then(json => {

            setAddress(json.results[0].formatted_address)
            setIsAddress(true)
		})
		.catch(error => console.warn(error));

    };

    useEffect(() => {
        getLocation();
    }, [])

    return (
            <KeyboardAvoidingView style={[styles.container, {backgroundColor: colors.background}]}>

                <View style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h1}>New</CustomText>
                    <CustomText weight='bold' color={colors.primary} size={h1}> Event</CustomText>
                </View>

                <View style={{width: '80%', alignItems: 'center', marginTop: 10, marginBottom: 30}}>
                    <CustomText align={'center'} color={colors.grey_d} size={h4}>Complete information about the event.</CustomText>
                </View>

                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    
                    <CustomInput
                        name="title"
                        control={control}
                        placeholder="Title"
                        rules={{
                            required: 'Title is required',
                        }}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'code-working-outline'}
                    />
                </View>

                <View style={{
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}> 
                <Controller
                    control={control}
                    name={'date'}
                    rules={{
                        required: 'Date is required',
                    }}
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <View style={{width: '47.5%', height: '100%'}}>    
                            <TouchableOpacity 
                                onPress={showDatePicker}
                                style={{
                                    width: '100%', 
                                    height: '100%', 
                                    flexDirection: 'row',
                                    backgroundColor: colors.grey_l,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    //justifyContent: 'center',
                                    borderColor: error ? 'red' : '#e8e8e8',
                                    borderWidth: 1
                                }}>
                                <View
                                    style={{
                                        width: 40,
                                        paddingLeft: 10,
                                        //alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    >
                                        <Ionicons name={'calendar-outline'} size={16} color={colors.grey_d}/>
                                </View>
                                
                                <CustomText size={12} color={dateString !== 'Select date' ? colors.text : colors.grey_d}>{dateString}</CustomText>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(date) => [onChange(date), handleConfirm(date)]}
                                    onCancel={hideDatePicker}
                                    themeVariant='light'
                                    isDarkModeEnabled={false}
                                    buttonTextColorIOS={colors.primary}
                                    selected={value}
                                    onBlur={onBlur}
                                /> 
                            </TouchableOpacity>
                        {error && (
                            <View style={{width: '100%'}}>
                            <CustomText color='red'>{error.message || 'Error'}</CustomText>
                            </View>
                            
                        )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name={'time'}
                    rules={{
                        required: 'Time is required',
                    }}
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <View style={{width: '47.5%', height: '100%'}}>     
                            <TouchableOpacity 
                                onPress={showTimePicker}
                                style={{
                                    width: '100%', 
                                    height: '100%', 
                                    flexDirection: 'row',
                                    backgroundColor: colors.grey_l,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    //justifyContent: 'center',
                                    borderColor: error ? 'red' : '#e8e8e8',
                                    borderWidth: 1
                                }}>
                                <View
                                    style={{
                                        width: 40,
                                        paddingLeft: 10,
                                        //alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    >
                                        <Ionicons name={'time-outline'} size={16} color={colors.grey_d}/>
                                </View>
                                
                                <CustomText size={12} color={timeString !== 'Select time' ? colors.text : colors.grey_d}>{timeString}</CustomText>
                                <DateTimePickerModal
                                    isVisible={isTimePickerVisible}
                                    mode="time"
                                    onConfirm={(time) => [onChange(time), handleTimeConfirm(time)]}
                                    onCancel={hideTimePicker}
                                    themeVariant='light'
                                    isDarkModeEnabled={false}
                                    buttonTextColorIOS={colors.primary}
                                    selected={value}
                                    onBlur={onBlur}
                                /> 
                            </TouchableOpacity>
                        {error && (
                            <View style={{width: '100%'}}>
                            <CustomText color='red'>{error.message || 'Error'}</CustomText>
                            </View>
                            
                        )}
                        </View>
                    )}
                />
                
                </View>

                <View style={{width: '90%', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
                    <CustomText align={'center'} color={colors.grey_d} size={h4}>Use your current location or select manually. The exact location will be made available after for other after your approval.</CustomText>
                </View>
                

                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    
                    <CustomInput
                        defaultValue={address}
                        name="location"
                        control={control}
                        placeholder={address}
                        rules={{
                            required: 'Location is required',
                        }}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'location-outline'}
                    />
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Indoor/Outdoor</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Guests</CustomText>
                </View>

                <View style={{width: '100%', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h3}>Description</CustomText>
                </View>

                <TouchableOpacity 
                    onPress={handleSubmit(onSignIn)}
                    style={{ 
                        width: '100%', 
                        height: 50, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20,
                        borderRadius: 10,
                        backgroundColor: colors.primary
                    }}>
                    <CustomText weight='bold' size={18} color={'white'}>Create event</CustomText>
                </TouchableOpacity>
                
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