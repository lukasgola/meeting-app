import React, {useState, useEffect} from 'react';
import {View, Modal, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Dimensions, ScrollView} from 'react-native';


//Hooks
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';

//Location
import Geocoder from 'react-native-geocoding';
import * as Location from "expo-location"

//Components
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';
import CustomMultilineInput from '../components/CustomMultilineInput';

//Date
import DateTimePickerModal from "react-native-modal-datetime-picker";

//Firebase
import { addEvent, auth } from '../firebase/firebase-config';
import { useCurrentUser } from '../currentUser/CurrentUserProvider';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useParties } from '../currentUser/PartiesProvider';

import {Picker} from '@react-native-picker/picker';

export default function AddEvent(){

    Geocoder.init("AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE");


    const { currentUser } = useCurrentUser();

    const navigation = useNavigation();
    const route = useRoute();

    const {parties, setParties} = useParties();

    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

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

    const [category, setCategory] = useState('Transport')

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
        let month = date.getMonth()+1;
        setDateString(date.getDate() + ' / ' + month + ' / ' + date.getFullYear())
        hideDatePicker();
    };


    const showCategoryPicker = () =>{
        
    }


    const { control, handleSubmit, formState: {errors} } = useForm();

    const onCreateEvent = async data => {
        const { title, maxGuests, description} = data;
        const event = {
            title: title,
            day: date.getDate(),
            month: date.getMonth()+1,
            year: date.getFullYear(),
            time_hour: time.getHours(),
            time_minute: time.getMinutes(),
            type: type,
            place: place,
            actGuests: 0,
            maxGuests: maxGuests,
            description: description,
            latitude: eventLocation.latitude,
            longitude: eventLocation.longitude,
            likes: 0,
        }
        const party = {
            id: auth.currentUser.uid,
            title: title,
            day: date.getDate(),
            month: date.getMonth()+1,
            year: date.getFullYear(),
            time_hour: time.getHours(),
            time_minute: time.getMinutes(),
            type: type,
            place: place,
            actGuests: 0,
            maxGuests: maxGuests,
            description: description,
            latitude: eventLocation.latitude,
            longitude: eventLocation.longitude,
            likes: 0,
            organizer: {
                avatar: currentUser.avatar,
                email: currentUser.email,
                score: currentUser.score,
                username: currentUser.username
            }
        }
        setParties([...parties, party]);
        addEvent(event);
        navigation.goBack();
    };

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);

    const [eventLocation, setEventLocation] = useState(null)

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
        setEventLocation(location.coords)
        setIsLocation(true)

        Geocoder.from(location.coords.latitude, location.coords.longitude)
		.then(json => {

            setAddress(json.results[0].formatted_address);
            setIsAddress(true);
		})
		.catch(error => console.warn(error));

    };

    useEffect(() => {
        getLocation();
    }, [])

    useEffect(() => {
        if(route.params?.eventLocation){
            setEventLocation(route.params?.eventLocation)
            Geocoder.from(route.params?.eventLocation.latitude, route.params?.eventLocation.longitude)
            .then(json => {

                setAddress(json.results[0].formatted_address)
                setIsAddress(true)
            })
            .catch(error => console.warn(error));
            }
    }, [route.params?.eventLocation])


    const [type, setType] = useState('Private');
    const [place, setPlace] = useState('Indoor');



    return (
        <KeyboardAvoidingView 
            keyboardVerticalOffset={50}
            behavior= {Platform.OS == "ios" ? "padding" : "height"}
            style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{width: width*0.9}}
            >
                <View style={{width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
                    <CustomText weight='bold' size={h1}>New</CustomText>
                    <CustomText weight='bold' color={colors.primary} size={h1}> Event</CustomText>
                </View>

                <View style={{width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 30}}>
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

                <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
                    <CustomText align={'center'} color={colors.grey_d} size={h4}>Use your current location or select manually. The exact location will be available for other users after your approval.</CustomText>
                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>   
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('MapChoose', {eventLocation})}
                        style={{
                            width: '100%', 
                            paddingVertical: 16,
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            //justifyContent: 'center',
                            borderColor: '#e8e8e8',
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
                                <Ionicons name={'location-outline'} size={16} color={colors.grey_d}/>
                        </View>
                        <View style={{height: '100%', width: '85%'}}>
                            <CustomText size={12} color={timeString !== 'Select time' ? colors.text : colors.text}>{address}</CustomText>
                        </View>
                        
                    </TouchableOpacity>
                </View>

                <View style={{width: '100%', marginTop: 20}}>
                    <CustomText color={colors.grey_d} size={h4}>Event category</CustomText>
                </View>

                <View style={{
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}> 
                    <View style={{width: '100%', height: '100%'}}>    
                        <TouchableOpacity 
                            onPress={showCategoryPicker}
                            style={{
                                width: '100%', 
                                height: '100%', 
                                flexDirection: 'row',
                                backgroundColor: colors.grey_l,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                //justifyContent: 'center',
                                borderColor: '#e8e8e8',
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
                            
                            <CustomText size={12} color={colors.text}>{category}</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) =>
                        setCategory(itemValue)
                    }
                >
                    <Picker.Item label="Party" value="Party" />
                    <Picker.Item label="Meeting" value="Meeting" />
                    <Picker.Item label="Transport" value="Transport" />
                    <Picker.Item label="Game" value="Game" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
                

                <View style={{width: '100%', marginTop: 20}}>
                    <CustomText color={colors.grey_d} size={h4}>Event type</CustomText>
                </View>

                <View style={{
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}> 
                    <TouchableOpacity 
                        onPress={() => setType('Private')}
                        style={{
                            width: '47.5%', 
                            height: '100%', 
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: type == 'Private' ? colors.primary : '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <CustomText weight={'bold'} size={12} color={type == 'Private' ? colors.text : colors.grey_d}>Private</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setType('Professional')}
                        style={{
                            width: '47.5%', 
                            height: '100%', 
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: type == 'Professional' ? colors.primary : '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <CustomText weight={'bold'} size={12} color={type == 'Professional' ? colors.text : colors.grey_d}>Professional</CustomText>
                    </TouchableOpacity>
                </View>

                <View style={{width: '100%', marginTop: 20}}>
                    <CustomText color={colors.grey_d} size={h4}>Event place</CustomText>
                </View>

                <View style={{
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}> 
                    <TouchableOpacity 
                        onPress={() => setPlace('Indoor')}
                        style={{
                            width: '47.5%', 
                            height: '100%', 
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: place == 'Indoor' ? colors.primary : '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <CustomText weight={'bold'} size={12} color={place == 'Indoor' ? colors.text : colors.grey_d}>Indoor</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setPlace('Outdoor')}
                        style={{
                            width: '47.5%', 
                            height: '100%', 
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: place == 'Outdoor' ? colors.primary : '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <CustomText weight={'bold'} size={12} color={place == 'Outdoor' ? colors.text : colors.grey_d}>Outdoor</CustomText>
                    </TouchableOpacity>
                </View>

                
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <CustomInput
                        name="maxGuests"
                        control={control}
                        placeholder="Max guests"
                        rules={{
                            required: 'Required',
                        }}
                        size={12} 
                        color={colors.grey_l} 
                        icon={'people-outline'}
                        keyboardType={'numeric'}
                    />
                </View>

                <View style={{width: '100%', marginTop: 20}}>
                    <CustomText color={colors.grey_d} size={h4}>Description</CustomText>
                </View>

                <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <CustomMultilineInput
                        name="description"
                        control={control}
                        placeholder="Write a few words about the event ..."
                        size={12} 
                        color={colors.grey_l} 
                        multiline={true}
                    />
                </View>
                


                <TouchableOpacity 
                    onPress={handleSubmit(onCreateEvent)}
                    style={{ 
                        width: '100%', 
                        height: 50, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20,
                        marginBottom: 40,
                        borderRadius: 10,
                        backgroundColor: colors.primary
                    }}>
                    <CustomText weight='bold' size={18} color={'white'}>Create event</CustomText>
                </TouchableOpacity>

            </ScrollView>
            
            
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
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