import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';

//Hooks
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

    const [marker, setMarker] = useState(route.params?.eventLocation)

    const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState(false)

    const [userLocation, setUserLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [region, setRegion] = useState({
        latitude:  null,
        longitude: null,
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
        onMapClick({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
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
        getLocation();

    }, [])


    const onMapClick = (coords) => {
        setMarker({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
    }

    const selectLocation = () => {
        navigation.navigate('AddEvent', { eventLocation: marker,
        
            onGoBack: () => refresh()})
    }

if(isLocation){


return (
    <View style={{flex: 1}}>
        
        <MapView 
            ref={mapRef}
            style={{width: '100%', height: '100%'}} 
            //provider={PROVIDER_GOOGLE}
            customMapStyle={mapSettingsLight}
            initialRegion={{
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            onRegionChange={reg => setRegion(reg)}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={false}
            onPress={(event) => onMapClick(event.nativeEvent.coordinate)}
        > 
            <Marker 
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                }}
                draggable={true}
            />
            <TouchableOpacity 
                onPress={selectLocation}
                style={{ 
                    position: 'absolute',
                    width: '90%', 
                    height: 50, 
                    marginLeft: '5%',
                    bottom: 40,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderRadius: 10,
                    backgroundColor: colors.primary
                }}>
                <CustomText weight='bold' size={18} color={colors.background}>Select this location</CustomText>
            </TouchableOpacity>
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

    </View>
)
}
else{
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
        </View>
        
    )
}
}