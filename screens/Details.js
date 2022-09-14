import React, { useState, useEffect } from 'react';
import {View, Image, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';

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

//Map settings
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions'



export default function Details(){

    Geocoder.init("AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE");

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const navigation = useNavigation()
    const route = useRoute()

    const h2 = 16;


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
    

    const location = {
        latitude: route.params.item.latitude,
        longitude: route.params.item.longitude
    }

    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;

    const isEvent = true;

    const [item, setItem] = useState(route.params.item)

    

    const [like, setLike] = useState(false)

    const onClickLike = () => {
        if(like) setLike(false)
        else setLike(true)
    }

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);

    const [city, setCity] = useState(null);
    const [isCity, setIsCity] = useState(false);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setIsLocation(true)
    };

    const calculateDistance = (latitude, longitude) => {
        var dis = getDistance(
            {latitude: userLocation.latitude, longitude: userLocation.longitude},
            {latitude: latitude, longitude: longitude},
        );
        return Math.round(dis/1000);
    };

    const handleGetDirections = (destLat, destLng) => {
        const data = {
           source: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          destination: {
            latitude: destLat,
            longitude: destLng
          },
          params: [
            {
              key: "travelmode",
              value: "driving"        // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate"       // this instantly initializes navigation using the given travel mode
            }
          ]
        }
        getDirections(data)
      }
    

    useEffect(() => {
        getLocation();

        Geocoder.from(route.params.item.latitude, route.params.item.longitude)
		.then(json => {
		var addressComponent = json.results[1].address_components[2];
			//console.log(addressComponent);
            setCity(addressComponent.long_name)
            setIsCity(true)
		})
		.catch(error => console.warn(error));
    }, [])

if(isLocation && isCity){
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    width: width,
                    height: 50,
                    bottom: 40,
                    zIndex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,

                    shadowColor: colors.primary,
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 5.84,

                    elevation: 6,
                }}
            >
                <View
                    style={{
                    height: '100%',
                    width: '20%',
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}
                >
                    <Ionicons name='chatbubbles-outline' size={30} color={'white'} />
                </View>
                <View
                    style={{
                    height: '100%',
                    width: '75%',
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}
                >
                    <CustomText weight='bold' color={'white'}>TAKE PART!</CustomText>
                </View>
                
            </View>

        <ScrollView style={{
            width: width,
            backgroundColor: colors.background,
        }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Map', {location, isEvent, item})}
                >
                    <MapView 
                        style={{width: '100%', height: 300}} 
                        provider={PROVIDER_GOOGLE}
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
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => handleGetDirections(route.params.item.latitude, route.params.item.longitude)}
                    style={{
                        width: 100,
                        height: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 10, right: 10,
                        backgroundColor: colors.background,
                        zIndex: 1,

                        shadowColor: colors.text,
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 3.84,

                        elevation: 6,
                    }}
                >
                    <CustomText weight='bold'>NAVIGATE</CustomText>
                </TouchableOpacity>

                <View
                    style={{
                        width: '100%',
                        backgroundColor: colors.background,
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
                    }}
                >
                    <View
                        style={{paddingHorizontal: 20}}
                    >
                        <View
                            style={{
                                width: '100%',
                                height: 30,
                                justifyContent: 'center',
                            }}
                        >
                            <CustomText weight='bold' size={22}>{route.params.item.title}</CustomText>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                height: 30,
                                marginTop: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons style={{marginRight: 10}} name='location-outline' size={20} color={colors.text} />
                            <CustomText size={14} color={colors.text} >{city}</CustomText>
                            <View style={{marginRight: 10}}></View>
                            <CustomText size={14} color={colors.grey_d} >( {calculateDistance(route.params.item.latitude, route.params.item.longitude)} km from you )</CustomText>

                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View
                                style={{
                                    width: '60%',
                                    height: 40,
                                    justifyContent: 'space-around',
                                    marginTop: 10,
                                    backgroundColor: colors.grey_l,
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }}
                            >
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name='time-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={14} color={colors.primary} >{route.params.item.time_hour}:{route.params.item.time_minute}</CustomText>
                                </View>
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name='calendar-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={14} color={colors.primary} >
                                        {route.params.item.day}/{route.params.item.month}/{route.params.item.year}
                                    </CustomText>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: '37.5%',
                                    height: 40,
                                    justifyContent: 'space-around',
                                    marginTop: 10,
                                    backgroundColor: route.params.item.actGuests == route.params.item.maxGuests ?   colors.secondary_l : colors.background,
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }}
                            >
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name='people' size={20} color={colors.primary} />
                                    <CustomText weight='bold' color={colors.text} size={14}>{route.params.item.actGuests}/{route.params.item.maxGuests}</CustomText>
                                </View>
                            </View>

                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View
                                style={{
                                    width: '70%',
                                    height: 40,
                                    justifyContent: 'space-around',
                                    marginTop: 10,
                                    backgroundColor: colors.grey_l,
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }}
                            >
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name='cloud-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={14} color={colors.primary} >{route.params.item.place}</CustomText>
                                </View>
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name='checkbox-outline' size={20} color={colors.primary} />
                                    <CustomText weight='bold' size={14} color={colors.primary} >Professional</CustomText>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: '27.5%',
                                    height: 40,
                                    justifyContent: 'space-around',
                                    marginTop: 10,
                                    //backgroundColor: colors.secondary_l,
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }}
                                onPress={() => onClickLike()}
                            >
                                <View style={styles.main_info_single}>
                                    <Ionicons style={{marginRight: 5}} name={like ? 'heart' : 'heart-outline'} size={20} color={like ? colors.secondary : colors.grey_d } />
                                    <CustomText weight='bold' color={like ? colors.text : colors.grey_d} size={14}>{route.params.item.likes}</CustomText>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View
                            style={{
                                width: '100%',
                                marginTop: 20
                            }}
                        >
                            <CustomText color={colors.grey_d}>The exact location will be made available after approval of the organizer</CustomText>
                        </View>
                        
                        <View
                            style={{
                                width: '100%',
                                marginTop: 20
                            }}
                        >
                            <CustomText weight='bold' size={h2}>Organizer</CustomText>
                        </View>

                        <View
                            style={{
                                width: '100%',
                                height: 120,
                                marginTop: 10,
                                flexDirection: 'row',
                                backgroundColor: colors.grey_l,
                                borderRadius: 10
                            }}
                        >
                            <View
                                style={{
                                    width: '30%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    //backgroundColor: 'red'
                                }}
                            >
                                <UserIcon size={80} photo={route.params.item.organizer_avatar} score={route.params.item.organizer_score} />
                                <View style={{width: '100%', height: 5}}></View>
                                <CustomText weight='bold' size={14} color={colors.text} >{route.params.item.organizer_username}</CustomText>
                            </View>
                            <View style={{width: '70%', height: '100%', paddingHorizontal: '2.5%'}}>
                                <View
                                    style={{
                                        width: '100%',
                                        height: '50%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{
                                        height: '80%',
                                        width: '100%',
                                        backgroundColor: colors.background,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Ionicons style={{marginRight: 5}} name='exit-outline' size={20} color={colors.text} />
                                        <CustomText weight='bold' size={14} color={colors.text} >See profile...</CustomText>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: '100%',
                                        height: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View style={{
                                        height: '80%',
                                        width: '100%',
                                        backgroundColor: colors.background,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Ionicons style={{marginRight: 5}} name='chatbubbles-outline' size={20} color={colors.primary} />
                                        <CustomText weight='bold' size={14} color={colors.primary} >Send messege...</CustomText>
                                    </View>
                                </View>
                            </View>
                            
                        </View>
                        <View
                            style={{
                                width: '100%',
                                marginTop: 20
                            }}
                        >
                            <CustomText weight='bold' size={h2}>Description</CustomText>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                marginTop: 10
                            }}
                        >
                            <CustomText color={colors.grey_d}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to</CustomText>
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
                        <CustomText weight='bold' size={h2}>Other users</CustomText>
                        <TouchableOpacity
                        >
                            <CustomText size={14} color={colors.primary}>Show All</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginTop: 10,
                            paddingBottom: 100,

                        }}
                    >
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
                            style={{
                                marginTop: 10
                            }}
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
    main_info_single:{
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //paddingLeft: 10
    }
})