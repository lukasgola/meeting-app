import React, { useState, useEffect } from 'react';
import {View, Platform, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';


//Hooks
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

//Components
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/CustomText';
import UserIcon from '../components/UserIcon';

//Location
import * as Location from "expo-location"
import {getDistance} from 'geolib';
import Geocoder from 'react-native-geocoding';

import { useCurrentLocation } from '../providers/CurrentLocationProvider';

//Map settings
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import getDirections from 'react-native-maps-directions'



import { auth, db } from '../firebase/firebase-config';
import { doc, getDoc } from "firebase/firestore";


export default function Details(){

    Geocoder.init("AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE");

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const navigation = useNavigation()
    const route = useRoute()

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14


    const data = [
        {
            id: 1
        },
        {
            id: 2
        },
        {
            id: 3
        }
    ]
    

    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;

    const isEvent = true;

    const [item, setItem] = useState(route.params.item)

    const [like, setLike] = useState(false)

    const onClickLike = () => {
        if(like) setLike(false)
        else setLike(true)
    }

    const {currentLocation, setCurrentLocation} = useCurrentLocation();

    const [city, setCity] = useState(null);

    const calculateDistance = (latitude, longitude) => {
        var dis = getDistance(
            {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
            {latitude: latitude, longitude: longitude},
        );

        return Math.round(dis/1000);
    };

    const handleGetDirections = (destLat, destLng) => {
        const data = {
           source: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          },
          destination: {
            latitude: destLat,
            longitude: destLng
          },
          params: [
            {
              key: "travelmode",
              value: "transit"        // may be "walking", "bicycling" or "transit" as well
            }
          ]
        }
        getDirections(data)
      }

      const [ user, setUser ] = useState();

    const getUser = async () => {

        const docRef = doc(db, "users", item.organizer);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
    }

    

    useEffect(() => {
        getUser();
        console.log(item.organizer)
        Geocoder.from(route.params.item.latitude, route.params.item.longitude)
		.then(json => {
		var addressComponent = json.results[1].address_components[2];
			//console.log(addressComponent);
            setCity(addressComponent.long_name)
		})
		.catch(error => console.warn(error));
    }, [])

if(currentLocation && city && user){
    return (
        <View style={[styles.container, {height: '40%'}]}>
            <View style={[styles.footer,{
                backgroundColor: colors.background, 
                shadowColor: colors.primary,
                borderTopColor: colors.grey,
                height: Platform.OS === 'ios' ? 80 : 65
            }]}>
                <TouchableOpacity 
                    onPress={() => alert('Send message')}
                    style={[styles.footer_button_left,{backgroundColor: colors.primary}]}>
                    <Ionicons name='chatbubbles-outline' size={30} color={'white'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => alert('Request was send')}
                    style={[styles.footer_button_right,{backgroundColor: colors.primary}]}>
                    <CustomText weight='bold' color={'white'} size={14}>TAKE PART!</CustomText>
                </TouchableOpacity>
                
            </View>

            <ScrollView style={{width: width, backgroundColor: colors.background}}>
                <MapView 
                    style={{width: '100%', height: 300}} 
                    provider={PROVIDER_GOOGLE}
                    onPress={() => navigation.navigate('Map', { location:{latitude: item.latitude, longitude: item.longitude} ,isEvent, item})}
                    //customMapStyle={mapSettings}
                    initialRegion={{
                        latitude: route.params.item.latitude - 0.01,
                        longitude: route.params.item.longitude,
                        latitudeDelta: 0.0922, 
                        longitudeDelta: 0.0421
                    }}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false}
                >
                    <Marker
                        key={route.params.item.id}
                        coordinate={{
                            latitude: route.params.item.latitude,
                            longitude: route.params.item.longitude
                        }}  
                    >
                        <Ionicons name='location' size={40} color={colors.primary} />
                    </Marker>
                </MapView>
                
                <TouchableOpacity 
                    onPress={() => handleGetDirections(route.params.item.latitude, route.params.item.longitude)}
                    style={[styles.navigate_button, {backgroundColor: colors.background, shadowColor: colors.text,}]}
                >
                    <CustomText size={h4} weight='bold'>NAVIGATE</CustomText>
                </TouchableOpacity>

                <View style={[styles.content_container, {backgroundColor: colors.background}]}>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={styles.title}>
                            <CustomText weight='bold' size={h2}>{route.params.item.title}</CustomText>
                        </View>
                        <View style={styles.location}>
                            <Ionicons style={{marginRight: 10}} name='location-outline' size={20} color={colors.text} />
                            <CustomText size={h4} color={colors.text} >{city}</CustomText>
                            <View style={{marginRight: 10}}></View>
                            <CustomText size={h4} color={colors.grey_d} >( {calculateDistance(route.params.item.latitude, route.params.item.longitude)} km from you )</CustomText>
                        </View>
                        <View style={styles.info_row}>
                            <View style={[styles.info_row_left, {width: '60%',backgroundColor: colors.grey_l}]}>
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name='time-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={h4} color={colors.primary} >{route.params.item.time_hour}:{route.params.item.time_minute == 0 ? "00" : route.params.item.time_minute }</CustomText>
                                </View>
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name='calendar-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={h4} color={colors.primary} >
                                        {route.params.item.day}/{route.params.item.month}/{route.params.item.year}
                                    </CustomText>
                                </View>
                            </View>
                            <View style={[styles.info_row_right, {width: '37.5%'}]}>
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name={route.params.item.actGuests == route.params.item.maxGuests ? 'people' : 'people-outline'} size={20} color={colors.primary} />
                                    <CustomText weight='bold' color={colors.text} size={h4}>{route.params.item.actGuests}/{route.params.item.maxGuests}</CustomText>
                                </View>
                            </View>

                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={[styles.info_row_left, {width: '70%', backgroundColor: colors.grey_l}]}>
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name='cloud-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={h4} color={colors.primary} >{route.params.item.place}</CustomText>
                                </View>
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name='checkbox-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={h4} color={colors.primary} >{route.params.item.type}</CustomText>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.info_row_right, {width: '27.5%'}]}
                                onPress={() => onClickLike()}
                            >
                                <View style={styles.info_row_single}>
                                    <Ionicons style={{marginRight: 5}} name={like ? 'heart' : 'heart-outline'} size={20} color={like ? colors.primary : colors.grey_d } />
                                    <CustomText weight='bold' color={like ? colors.text : colors.grey_d} size={h4}>{route.params.item.likes}</CustomText>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View style={{width: '100%', marginTop: 20}}>
                            <CustomText size={h4} color={colors.grey_d}>The exact location will be made available after approval of the organizer</CustomText>
                        </View>
                        
                        <View style={{width: '100%', marginTop: 20}}>
                            <CustomText weight='bold' size={h3}>Organizer</CustomText>
                        </View>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Profile', {user: route.params.item.organizer})}
                            style={[styles.organizer, {backgroundColor: colors.grey_l}]}>
                            <View style={styles.organizer_avatar}>
                                <UserIcon size={60} avatar={user.avatar} score={user.score} />
                                <View style={{width: '100%', height: 5}}></View>
                                <CustomText weight='bold' size={h4} color={colors.text} >{route.params.item.organizer.username}</CustomText>
                            </View>
                            <View style={styles.organizer_links}>
                                <View style={[styles.organizer_link]}>
                                    <CustomText weight='bold' size={h2}>3</CustomText>
                                    <CustomText color={colors.grey_d} size={h4}>Events</CustomText>
                                </View>
                                <View style={[styles.organizer_link]}>
                                    <CustomText weight='bold' size={h2}>123</CustomText>
                                    <CustomText color={colors.grey_d} size={h4}>Followers</CustomText>
                                </View>
                                <View style={[styles.organizer_link]}>
                                    <CustomText weight='bold' size={h2}>123</CustomText>
                                    <CustomText color={colors.grey_d} size={h4}>Following</CustomText>
                                </View>
                            </View>
                            
                        </TouchableOpacity>
                        <View style={{width: '100%', marginTop: 20}}>
                            <CustomText weight='bold' size={h3}>Description</CustomText>
                        </View>
                        <View style={{width: '100%', marginTop: 10}}>
                            <CustomText size={h4} color={colors.grey_d}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to</CustomText>
                        </View>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginTop: 20,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <CustomText weight='bold' size={h3}>Other users</CustomText>
                        <TouchableOpacity>
                            <CustomText size={h4} color={colors.primary}>Show All</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '100%', marginTop: 10, paddingBottom: 100}}>
                        <FlatList
                            data={data}
                            renderItem={({item}) => (
                                <View
                                    style={{
                                        width: 60,
                                        marginLeft: 20,
                                    }}
                                >
                                    <UserIcon size={60} photo={route.params.item.organizer_avatar} score={4.56} />
                                </View>
                            )
                            }
                            keyExtractor={(item) => item.id}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    
                </View>
            </ScrollView>
        </View>
    );
}else {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator />
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    footer:{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        borderTopWidth: 1,

        
    },
    footer_button_left: {
        height: 45,
        width: '35%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer_button_right: {
        height: 45,
        width: '60%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigate_button: {
        width: '30%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10, right: 10,
        zIndex: 1,

        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,

        elevation: 6,
    },
    content_container: {
        width: '100%',
        marginTop: -100,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10.84,

        elevation: 10,
    },
    title: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
    },
    location: {
        width: '100%',
        height: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    info_row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    info_row_left: {
        height: 40,
        justifyContent: 'space-around',
        marginTop: 10,
        borderRadius: 10,
        flexDirection: 'row'
    },
    info_row_right: {
        height: 40,
        justifyContent: 'space-around',
        marginTop: 10,
        borderRadius: 10,
        flexDirection: 'row'

    },
    info_row_single: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    organizer: {
        width: '100%',
        height: 120,
        marginTop: 10,
        flexDirection: 'row',
        borderRadius: 10,
    },
    organizer_avatar: {
        width: '30%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    organizer_links: {
        width: '70%', 
        height: '100%', 
        padding: '2.5%', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    organizer_link: {
        height: '60%',
        width: '30%',
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})