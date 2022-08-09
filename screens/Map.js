import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';

//Map settings
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';

//Amplify
import { API, graphqlOperation } from 'aws-amplify'
import { listUsers, listEvents } from '../src/graphql/queries';

//Location
import * as Location from "expo-location"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE, Heatmap, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'

import Ionicons from 'react-native-vector-icons/Ionicons';



export default function Map({navigation, route}){

    const INITIAL_LOCATION = route.params.location;
    const DEFAULT_DELTA = {latitudeDelta: 0.0922, longitudeDelta: 0.0421 }

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;

    const [item, setItem] = useState(route.params.isEvent ? route.params.item : null);

    const [selectedPlaceId, setSelectedPlaceId] = useState();

    const [users, setUsers] = useState([])
    const [parties, setParties] = useState([])

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [region, setRegion] = useState(null);

    const [destination, setDestination] = useState({
        latitude: null,
        longitude: null
    })

    const mapRef = useRef();

    const moveTo = async (position) => {
        const camera = await mapRef.current.getCamera();
        if(camera){
            camera.center = position;
            mapRef.current.animateCamera(camera, {duration: 1000})
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

    useEffect(() => {
        const fetchUsers = async () => {
            try{

                const usersResult = await API.graphql(
                    graphqlOperation(listUsers)
                )

                setUsers(usersResult.data.listUsers.items);
                if(route.params.isEvent){
                    setSelectedPlaceId(route.params.item.id)
                    setDestination({latitude: route.params.item.latitude, longitude: route.params.item.longitude})
                }
                
            }catch (e){
                console.log(e);
            }
        }

        fetchUsers();

        const fetchParties = async () => {
            try{

                const partiesResult = await API.graphql(
                    graphqlOperation(listEvents)
                )

                setParties(partiesResult.data.listEvents.items);

            }catch (e){
                console.log(e);
            }
        }

        fetchParties();

        getLocation();
        setRegion({
            latitude: route.params.latitude,
            longitude: route.params.longitude,
            latitudeDelta: DEFAULT_DELTA.latitudeDelta,
            longitudeDelta: DEFAULT_DELTA.longitudeDelta,
        })

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
                        
/*
                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                              right: 100,
                              bottom: 150,
                              left: 100,
                              top: 100,
                            },
                            animated: true
                        });
*/
                    }}
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
                    <FlatListItem item={item} navigation={navigation} user={users[0]} location={userLocation} />
                </View>
                
            )
        }
    }

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
                
                    <Callout 
                        tooltip
                        onPress={() => handleGetDirections(latitude, longitude)}
                        style={{ 
                            backgroundColor: colors.grey_l, 
                            borderRadius: 10, 
                            padding: 5, 
                            width: 100,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CustomText weight='bold'>Navigate</CustomText>
                    </Callout>

                </Marker>
                    
            ))
        )
    }


    if(isLocation){

    return (
        <View style={{flex: 1}}>

            <MapView 
                ref={mapRef}
                style={{width: '100%', height: '100%'}} 
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapSettings}
                initialRegion={{
                    latitude: INITIAL_LOCATION.latitude,
                    longitude: INITIAL_LOCATION.longitude,
                    latitudeDelta: 0.3922,
                    longitudeDelta: 0.2421,
                }}
                onRegionChange={reg => setRegion(reg)}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >

                {renderMarkers()}

                {renderMapViewDirections()}

                <Heatmap
                    initialRegion={{
                        latitude: INITIAL_LOCATION.latitude,
                        longitude: INITIAL_LOCATION.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
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
                styles={{
                    container:{
                        width: width*0.9,
                        height: 400,
                        position: 'absolute',
                        zIndex: 1,
                        flex: 0,
                        marginLeft: width*0.05
                    },
                    textInput:{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 12,
                        height: 40,
                        color: colors.text,
                        marginTop: 10,
                        backgroundColor: colors.background
                    }
                    }}
            /> 

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