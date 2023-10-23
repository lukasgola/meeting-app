import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';

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

    
    const DEFAULT_DELTA = {
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const [region, setRegion] = useState({
        latitude: route.params.item ? route.params.item.latitude : currentLocation.latitude,
        longitude: route.params.item ? route.params.item.longitude : currentLocation.longitude,
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

    useEffect(() => {
        getParties();
        if(route.params.item){
            onMarkerClick(route.params.item)
        }
    }, [])

    return (
        <View style={{flex: 1}}>
            <MapView 
                ref={mapRef}
                style={{width: '100%', height: '100%'}} 
                //provider={PROVIDER_GOOGLE}
                customMapStyle={mapSettings}
                initialRegion={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                }}
                onRegionChange={reg => setRegion(reg)}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >

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
                borderBottomLeftRadius: 10, 
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

        </View>
    )
}