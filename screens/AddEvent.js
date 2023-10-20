import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, Alert, TouchableOpacity, Dimensions, ScrollView} from 'react-native';

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
import BottomSheet from '../components/BottomSheet';

//Date
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import {Picker} from '@react-native-picker/picker';

//Firebase
import { addEvent } from '../firebase/firebase-config';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddEvent(){

    Geocoder.init("AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE");

    const navigation = useNavigation();
    const route = useRoute();

    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const [date, setDate] = useState(new Date());
    const [dateString, setDateString] = useState('Select date')

    const [time, setTime] = useState(new Date())
    const [timeString, setTimeString] = useState('Select time')

    const [eventLocation, setEventLocation] = useState(null)
    const [address, setAddress] = useState(null);

    const [category, setCategory] = useState('Party')
    const [categoryString, setCategoryString] = useState('Party');

    const [type, setType] = useState('Private');
    const [place, setPlace] = useState('Indoor');

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isCategoryPickerVisible, setCategoryPickerVisible] = useState(false);

    const types = [
        { label: 'Party', value: 'Party' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Game', value: 'Game' },
        { label: 'Other', value: 'Other'},
    ]

    const onChangeTime = (event, value) => {
        setTime(value);
    };

    const handleTimeConfirm = () => {
        setTime(time)
        setTimeString(time.getHours() + ':' + (time.getMinutes() <= 9 ? ("0" + time.getMinutes()) : time.getMinutes()))
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const handleDateConfirm = () => {
        let month = date.getMonth()+1;
        setDateString(date.getDate() + ' / ' + month + ' / ' + date.getFullYear())
    };


    const handleCategoryConfirm = () => {
        setCategory(categoryString);
    }


    const { control, handleSubmit, formState: {errors} } = useForm();

    const onCreateEvent = async data => {
        Alert.alert('New Event', 'Do you want to public this event?', [
        {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
        },
        {
            text: 'Yes',
            onPress: () => {
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
                    description:  description ? description : 'none',
                    latitude: eventLocation.latitude,
                    longitude: eventLocation.longitude,
                    likes: 0,
                    category: category
                }
                addEvent(event);
            }},
        ]);
        
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setEventLocation(location.coords)

        Geocoder.from(location.coords.latitude, location.coords.longitude)
		.then(json => {

            setAddress(json.results[0].formatted_address);
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
            })
            .catch(error => console.warn(error));
            }
    }, [route.params?.eventLocation])

    return (
        <KeyboardAvoidingView 
            keyboardVerticalOffset={50}
            behavior= {Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1,alignItems: 'center', backgroundColor: colors.background}}>
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
                
                    <View style={{width: '47.5%', height: '100%'}}>    
                        <TouchableOpacity 
                            onPress={() => setDatePickerVisibility(true)}
                            style={{
                                width: '100%', 
                                height: '100%', 
                                flexDirection: 'row',
                                backgroundColor: colors.grey_l,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: '#e8e8e8',
                                borderWidth: 1
                            }}>
                            <View
                                style={{
                                    width: 40,
                                    paddingLeft: 10,
                                    justifyContent: 'center'
                                }}
                                >
                                    <Ionicons name={'calendar-outline'} size={16} color={colors.grey_d}/>
                            </View>
                            
                            <CustomText size={12} color={dateString !== 'Select date' ? colors.text : colors.grey_d}>{dateString}</CustomText>
                            <BottomSheet 
                                visible={isDatePickerVisible}
                                setModalVisible={setDatePickerVisibility}
                                text={'Choose the date'}
                                onConfirm={handleDateConfirm}
                            >
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={onChangeDate}
                                    textColor={colors.text}
                                />
                            </BottomSheet>
                        </TouchableOpacity>
                    </View>

                    <View style={{width: '47.5%', height: '100%'}}>     
                        <TouchableOpacity 
                            onPress={()=> setTimePickerVisibility(true)}
                            style={{
                                width: '100%', 
                                height: '100%', 
                                flexDirection: 'row',
                                backgroundColor: colors.grey_l,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: '#e8e8e8',
                                borderWidth: 1
                            }}>
                            <View
                                style={{
                                    width: 40,
                                    paddingLeft: 10,
                                    justifyContent: 'center'
                                }}
                                >
                                    <Ionicons name={'time-outline'} size={16} color={colors.grey_d}/>
                            </View>
                            
                            <CustomText size={12} color={timeString !== 'Select time' ? colors.text : colors.grey_d}>{timeString}</CustomText>
                            <BottomSheet 
                                visible={isTimePickerVisible}
                                setModalVisible={setTimePickerVisibility}
                                text={'Choose the time'}
                                onConfirm={handleTimeConfirm}
                            >
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time}
                                    mode={'time'}
                                    display="spinner"
                                    onChange={onChangeTime}
                                    textColor={colors.text}
                                    minuteInterval={1}
                                    accentColor={colors.primary}
                                    locale='es-ES'
                                />
                            </BottomSheet>
                        </TouchableOpacity>
                    </View>
                
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
                            borderColor: '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <View
                            style={{
                                width: 40,
                                paddingLeft: 10,
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

                <TouchableOpacity 
                    onPress={() => setCategoryPickerVisible(true)}
                    style={{
                        width: '100%',
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10
                    }}
                >   
                    <View 
                        style={{
                            width: '100%', 
                            height: '100%', 
                            flexDirection: 'row',
                            backgroundColor: colors.grey_l,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#e8e8e8',
                            borderWidth: 1
                        }}>
                        <View
                            style={{
                                width: 40,
                                paddingLeft: 10,
                                justifyContent: 'center'
                            }}
                            >
                                <Ionicons name={'time-outline'} size={16} color={colors.grey_d}/>
                        </View>
                        <CustomText size={12} color={colors.text}>{categoryString}</CustomText>
                    </View>
                    <BottomSheet 
                        visible={isCategoryPickerVisible} 
                        setModalVisible={setCategoryPickerVisible}
                        text={'Wybierz kategorię'}
                        onConfirm={handleCategoryConfirm}
                    >
                        <Picker
                            selectedValue={categoryString}
                            onValueChange={(itemValue, itemIndex) =>{
                                setCategoryString(itemValue)
                            }
                            }>
                                {types.map((item) => (
                                    <Picker.Item label={item.label} value={item.value} key={item.value} />
                                ))}
                        </Picker>
                    </BottomSheet>
                </TouchableOpacity>
                
                

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