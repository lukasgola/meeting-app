import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';

//Location
import * as Location from "expo-location"

//Map
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';


//Firebase
import { db } from '../firebase/firebase-config'
import { getDoc, getDocs, collectionGroup } from "firebase/firestore";


import Ionicons from 'react-native-vector-icons/Ionicons';



export default function Map(){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const mapRef = useRef();


    const DEFAULT_DELTA = {
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;

    const [item, setItem] = useState(null);

    const [selectedPlaceId, setSelectedPlaceId] = useState(null);


    const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState(false)

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [region, setRegion] = useState({
        latitude: route.params.location.latitude,
        longitude: route.params.location.longitude,
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
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: DEFAULT_DELTA.latitudeDelta,
                longitudeDelta: DEFAULT_DELTA.longitudeDelta
        
        }
        moveTo(position)
    }


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

    const getParties = async () => {

        const querySnapshot = await getDocs(collectionGroup(db, "parties"));

        querySnapshot.forEach( async (doc)  => {

            const docRef = doc.ref.parent.parent;   
            const userSnap = await getDoc(docRef);
            const organizer = userSnap.data();

            const party = {
                ...doc.data(),
                id: doc.id,
                organizer: {
                    avatar: organizer.avatar,
                    email: organizer.email,
                    score: organizer.score,
                    username: organizer.username
                }
            }

            setParties(old => [...old, party])
                
        });
        setIsParties(true);
    }

    useEffect(() => {
        setParties([])
        if(route.params.isEvent){
            setSelectedPlaceId(route.params.item.id)
            setItem(route.params.item)
            setDestination({latitude: route.params.item.latitude, longitude: route.params.item.longitude})
        }
        getParties();
        getLocation();

    }, [])


    const renderMapViewDirections = () => {
        if(destination.latitude != null){
            return(
                <MapViewDirections
                    origin={userLocation}
                    destination={destination}
                    apikey='AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE'
                    strokeWidth={3}
                    strokeColor={colors.text} 
                    onReady={result => {
                        
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)

                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                              right: 100,
                              bottom: 250,
                              left: 100,
                              top: 100,
                            },
                            animated: true
                    })}}
                />
            )
        }
    }


    const renderParty = () => {
        if(selectedPlaceId != null){
            return(
                <View>
                    <TouchableOpacity 
                        onPress={() => [setSelectedPlaceId(null), setDestination({latitude: null, longitude: null})]}
                        style={{position: 'absolute', width: 40, height: 40, zIndex: 1, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name='close-outline' size={30} color={colors.text} />
                    </TouchableOpacity>
                    <FlatListItem item={item} location={userLocation} />
                </View>
                
            )
        }
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
                    onPress={() => [setSelectedPlaceId(marker.id), setItem(marker), setDestination({latitude: marker.latitude, longitude: marker.longitude})]}
                >
                    <Ionicons name='location' size={40} color={selectedPlaceId == marker.id ? colors.primary : colors.text} />

                </Marker>
                    
            ))
        )
    }


    if(isLocation && isParties){

    return (
        <View style={{flex: 1}}>

            <MapView 
                ref={mapRef}
                style={{width: '100%', height: '100%'}} 
                provider={PROVIDER_GOOGLE}
                //customMapStyle={mapSettings}
                initialRegion={{
                    latitude: route.params.location.latitude,
                    longitude: route.params.location.longitude,
                    latitudeDelta: 1.009,
                    longitudeDelta: 1.009
                }}
                onRegionChange={reg => setRegion(reg)}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >

                {renderMarkers()}

                {renderMapViewDirections()}

                <Heatmap
                    initialRegion={region}
                    points={parties}
                    radius={50}
                    gradient={{
                        colors: ['black'],
                        startPoints: [0.9],
                        colorMapSize: 256
                    }}
                    opacity={0.3}
                >

                </Heatmap>

            </MapView>

            <View style={{position:'absolute', borderRadius: 10, top: 10, marginLeft: '5%', width: '90%', height: 50, backgroundColor: colors.background}}>
                <GooglePlacesAutocomplete
                    fetchDetails={true}
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                        onPlaceSelected(details);

                    }}
                    query={{
                        key: 'AIzaSyAW_vjG_Tr8kxNtZF7Iq6n72JF1Spi2RZE',
                        language: 'en',
                        components: 'country:pl'
                    }}
                    textInputProps={{
                        placeholderTextColor: colors.grey_d,
                    }}
                    renderLeftButton={() => 
                        <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name='search' size={20} color={colors.grey_d} />
                        </View>
                    }
                    styles={{
                        container:{
                            width: '100%',
                            height: 400,
                            position: 'absolute',
                            zIndex: 1,
                            flex: 0,
                        },
                        textInput:{
                            fontFamily: 'Montserrat-Regular',
                            fontSize: 14,
                            height: 50,
                            color: colors.text,
                            marginLeft: -10
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
            

            <View style={{position: 'absolute', bottom: 20}}>
                {renderParty()}
            </View>

        </View>
    )
    }else {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator />
            </View>
            
        )
    }
}