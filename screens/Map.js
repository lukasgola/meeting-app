import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//Hooks
import {useTheme} from '../theme/ThemeProvider';
import { useRoute } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';
import MapPartyCard from '../components/MapPartyCard';
import MapMarker  from '../components/MapMarker';

//Providers
import { useCurrentLocation } from '../providers/CurrentLocationProvider';

//Map
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';

//Firebase
import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup } from "firebase/firestore";

import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Map({navigation}){

    const {colors} = useTheme();
    const route = useRoute();
    const mapRef = useRef();

    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;


    const [item, setItem] = useState(null);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [directionMode, setDirectionMode] = useState(null);
    const [partyRouteDetails, setPartyRouteDetails] = useState(null);

    const [parties, setParties] = useState([])

    const {currentLocation} = useCurrentLocation();

    const [ chooseMarker, setChooseMarker ] = useState(null);
    const [ address, setAddress ] = useState(null);

    
    const DEFAULT_DELTA = {
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    }

    const [region, setRegion] = useState({
        latitude: route.params?.isEvent ? route.params.item.latitude : currentLocation.latitude,
        longitude: route.params?.isEvent ? route.params.item.longitude : currentLocation.longitude,
        latitudeDelta: DEFAULT_DELTA.latitudeDelta,
        longitudeDelta: DEFAULT_DELTA.longitudeDelta,
    });

    const [destination, setDestination] = useState({
        latitude: null,
        longitude: null
    })


    const moveTo = async (position) => {
        const camera = await mapRef.current.getCamera();
        if(camera){
            camera.center = position;
            mapRef.current.animateCamera(camera, {duration: 500})
        }
    }

    
    const onPlaceSelected = (details) => {
        const position = {
                latitude: details.latitude,
                longitude: details.longitude,
                latitudeDelta: DEFAULT_DELTA.latitudeDelta,
                longitudeDelta: DEFAULT_DELTA.longitudeDelta
        }
        moveTo(position)
    }



    const PartyCard = () => {
        if(selectedPlaceId) {
            return (
                <MapPartyCard 
                    item={item} 
                    onCancel={onPartyCardCancel}
                    visible={selectedPlaceId}
                    route={partyRouteDetails}
                />
            )
        }
    }

    const onPartyCardCancel = () => {
        setSelectedPlaceId(null), 
        setDestination({latitude: null, longitude: null}),
        setPartyRouteDetails(null)
        setDirectionMode(null)
    }

    const PartyRouteModes = () => {

        const modes = [
            {
                id: 1,
                name: 'DRIVING'
            },
            {
                id: 2,
                name: 'WALKING'
            },
            {
                id: 3,
                name: 'TRANSIT'
            },
            {
                id: 4,
                name: 'BICYCLING'
            },
        ]

        const onDirectionModeCancel = () => {
            setDirectionMode(null)
            setPartyRouteDetails(null)
            moveTo({latitude: item.latitude, longitude: item.longitude})
        }

        if(selectedPlaceId !== null)   
        return(
            <View style={{height:30}}>
                <FlatList 
                    data={modes}
                    renderItem={({item}) => 
                        <TouchableOpacity 
                            onPress={() => directionMode !== item.name ? setDirectionMode(item.name) : onDirectionModeCancel()} 
                            style={{
                                //padding: 10,
                                paddingHorizontal: 13,
                                height: '100%',
                                backgroundColor: directionMode == item.name ? colors.text : colors.background,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                                marginLeft: 10,
                        }}>
                            <CustomText size={12} color={directionMode == item.name ? colors.background : colors.text} weight='bold'>{item.name}</CustomText>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.id}
                    horizontal
                />
            </View>
            
        )
    }

    const onMarkerClick = (marker) => {
        setSelectedPlaceId(marker.id)
        setItem(marker)
        setDestination({latitude: marker.latitude, longitude: marker.longitude})
        onPlaceSelected({latitude: marker.latitude, longitude: marker.longitude})
    }


    const setLocation = (location, timeout) => {
        setChooseMarker(location);

        Geocoder.from(location.latitude, location.longitude)
            .then(json => {

                setAddress(json.results[0].formatted_address)
            })
            .catch(error => console.warn(error));
            
        setTimeout(() => {
            moveTo(location)
        }, timeout)
    }

    const onLocationConfirm = () => {
        navigation.navigate('AddEvent', {eventLocation: chooseMarker})
    }

    const renderMarkers = () => {
        return(
            parties.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                    onPress={() => onMarkerClick(marker)}
                >
                    <MapMarker marker={marker} selectedPlaceId={selectedPlaceId} />
                </Marker> 
            ))
        )
    }

    const getParties = async () => {

        const querySnapshot = await getDocs(collectionGroup(db, "parties"));

        const parties = [];
        
        querySnapshot.forEach((doc) => { 

            parties.push({
                ...doc.data(),
                id: doc.id,
                organizer: doc.ref.parent.parent.id
            })
        });
        setParties(parties);
    }

    const onQuickAction = () => {
        navigation.navigate('QuickAction')
    }

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: route.params?.mapChoose && 'Choose event location',
          headerRight: () =>  !route.params?.mapChoose &&
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
                <Ionicons name='create-outline' size={25} color={colors.primary}/>
            </TouchableOpacity>,
        });
    }, []);

    useEffect(() => {
        if(route.params?.mapChoose){
            setLocation(currentLocation)
        }
        else{
            getParties();
            if(route.params?.isEvent){
                setSelectedPlaceId(route.params.item.id)
                setItem(route.params.item)
                setDestination({latitude: route.params.item.latitude, longitude: route.params.item.longitude})
            }
        }
    }, [])

    return (
        <View style={{flex: 1}}>
            <MapView 
                ref={mapRef}
                style={{width: '100%', height: '100%'}} 
                //provider={PROVIDER_GOOGLE}
                customMapStyle={mapSettings}
                initialRegion={region}
                onRegionChange={reg => setRegion(reg)}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
                onPress={(event) =>  (route.params?.mapChoose && setLocation(event.nativeEvent.coordinate, 0))}
            >

                {route.params?.mapChoose && chooseMarker !== null ? 
                    <Marker 
                        coordinate={{
                            latitude: chooseMarker.latitude,
                            longitude: chooseMarker.longitude
                        }}
                        draggable={true}
                        onDragEnd={(event) => setLocation(event.nativeEvent.coordinate, 500) }
                    />
                    :
                    <View></View>
                }

                {renderMarkers()}

                {directionMode !== null ? 
                    <MapViewDirections
                        origin={currentLocation}
                        destination={destination}
                        strokeWidth={3}
                        strokeColor={colors.primary}
                        mode={directionMode}
                        apikey='AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE'
                        onReady={result => {
                            
                            mapRef.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: 100,
                                    bottom: 250,
                                    left: 100,
                                    top: 100,
                                },
                                animated: true
                            })
                            setPartyRouteDetails(result)
                        }}
                    />
                    : <View></View>}



            </MapView>

            <View style={{
                position:'absolute', 
                borderBottomLeftRadius: 5, 
                borderBottomRightRadius: 10, 
                width: '100%', 
                height: selectedPlaceId !== null ? 90: 50, 
                backgroundColor: colors.background,
                borderTopWidth: 1,
                borderColor: colors.grey_l,
                paddingTop: selectedPlaceId !== null ? 10: 0
            }}>
                <PartyRouteModes />
                <View style={{height: 50}}>
                    <GooglePlacesAutocomplete
                        fetchDetails={true}
                        placeholder='Search'
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(details);

                            moveTo({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                            if(route.params?.mapChoose){
                                setLocation({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                            }

                        }}
                        query={{
                            key: 'AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE',
                            language: 'en',
                            components: 'country:pl'
                        }}
                        textInputProps={{
                            placeholderTextColor: colors.grey_d,
                        }}
                        enablePoweredByContainer={false}
                        renderLeftButton={() => 
                            <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Ionicons name='search' size={20} color={colors.grey_d} />
                            </View>
                        }
                        styles={{
                            container:{
                                width: '100%',
                                height: 400,
                                zIndex: 1,
                                flex: 0,
                            },
                            textInput:{
                                height: 49
                            }
                            
                            }}
                        renderRow={(item) =>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Ionicons name='location-outline' size={20} color={colors.grey_d} style={{marginRight: 15}} />
                                <CustomText>{item.description}</CustomText>
                            </View>
                        }
                    />
                </View>
            </View>

            {PartyCard()}

            {(route.params?.isQuickLaunch && (selectedPlaceId == null)) && 
                <TouchableOpacity
                    onPress={() => onQuickAction() }
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        width: '90%',
                        marginLeft: '5%',
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: colors.primary,
                    }}
                >
                    <LinearGradient
                        colors={[colors.primary, '#00cfb3']}
                        start={{x: 0, y: 0.5}}
                        end={{ x: 0.8, y: 0.5 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <CustomText weight='bold' size={18} color={colors.background}>Quick Action</CustomText>
                    </LinearGradient>
                </TouchableOpacity>
            }
            
            {route.params?.mapChoose && 
                <View style={{
                    position: 'absolute',
                    bottom: 40,
                    width: '100%',
                    paddingHorizontal: '5%'
                }}>
                    <View style ={{
                        width: '100%',
                        height: 50,
                        backgroundColor: colors.background,
                        borderRadius: 10,
                        justifyContent: 'center', 
                        alignItems: 'center', 
                    }}>
                        <CustomText>{address}</CustomText>
                    </View>
                    <TouchableOpacity 
                        onPress={() => onLocationConfirm()}
                        style={{ 
                            width: '100%', 
                            height: 50, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 10,
                            backgroundColor: colors.primary,
                            marginTop: 10
                        }}>
                        <CustomText weight='bold' size={18} color={colors.background}>Select this location</CustomText>
                    </TouchableOpacity>
                </View>
                
            }
        </View>
    )
}