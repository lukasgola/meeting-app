import React, {useState, useEffect, useContext} from 'react';
import {View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//ContextAPI
import { PracticeContext } from '../contextAPI/ContextAPI';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';


//Location
import * as Location from "expo-location"

//Map
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Ionicons from 'react-native-vector-icons/Ionicons';

//Firestore
import { db } from '../firebase/firebase-config'
import { collection, query, where, getDocs, collectionGroup } from "firebase/firestore";




export default function Main(){

    const width = Dimensions.get('window').width;


    const {colors} = useTheme();
    const navigation = useNavigation();

    const {currentUser, setCurrentUser} = useContext(PracticeContext);


    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;


    const [users, setUsers] = useState([])
    const [isUsers, setIsUsers] = useState(false)

    const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState(false)

    const [location, setLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);


    const isEvent = false;


    const getLocation = async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        setIsLocation(true)
    };


    const getParties = async () => {
        const querySnapshot = await getDocs(collectionGroup(db, "parties"));

        const parties = [];

        querySnapshot.forEach((doc) => {
            parties.push({
                ...doc.data(),
                id: doc.id,
              });
        });
        setParties(parties);
        setIsParties(true);
    }

    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));

        const users = [];

        querySnapshot.forEach((doc) => {
            users.push({
                ...doc.data(),
                id: doc.id,
              });
        });
        setUsers(users)
        setIsUsers(true);
    }


    useEffect(() => {    
        getLocation();
        getParties();
        getUsers();
    }, [])


    const renderPopularItem = ({item}) => {
        return(
            <PopularItem item={item} navigation={navigation} location={location} />
        )
    }


    const renderUser =({item}) => {
        return(
            <TrendingUser item={item} navigation={navigation} />
        )
    }

    const renderHorizontal = (data, renderItem) => {
        return(
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        ) 
    }

    const renderFlatlist = (data) => {
        return(
            <FlatList
                data={data.slice(0,3)}
                renderItem={({item}) => <FlatListItem item={item} navigation={navigation} location={location} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{ width: '100%', marginVertical: 20 }}>

                        <View style={{ marginLeft: 0.05*width }}>
                            <View style={{ width: 0.9*width, flexDirection:'row' }}>
                                <CustomText weight='bold' size={25}>Welcome</CustomText>
                                <CustomText weight='bold' size={25} color={colors.primary}> {currentUser.username}</CustomText>
                            </View>
                            <CustomText size={14} color={colors.text}>Check out the map</CustomText>
                            
                            <TouchableOpacity
                                style={{
                                    width: 0.9*width,
                                    height: 120,
                                    borderRadius: 10,
                                    marginTop: 10,
                                    marginBottom: 20
                                }}
                                onPress={() => navigation.navigate('Map', {location, isEvent})}
                            >
                                <MapView 
                                    style={{width: '100%', height: '100%', borderRadius: 10}} 
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={mapSettings}
                                    initialRegion={{
                                        latitude: 50.5107,
                                        longitude: 18.30056,
                                        latitudeDelta: 0.0922, 
                                        longitudeDelta: 0.0821
                                    }}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                    scrollEnabled={false}

                                >
                                {parties.map((marker) => (
                                    <Marker
                                        key={marker.id}
                                        coordinate={{
                                            latitude: marker.latitude,
                                            longitude: marker.longitude,
                                        }}  
                                    >
                                        <Ionicons name='location' size={40} color={colors.primary} />

                                    </Marker>
                                ))}

                                </MapView>
                            </TouchableOpacity>
                        </View>
                        

                        <View style={{ marginLeft: 0.05*width }}>
                            <View
                                style={{ width: 0.9*width, flexDirection:'row', justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={20}>Popular Near You</CustomText>
                                <TouchableOpacity
                                >
                                    <CustomText size={14} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                                
                            </View>
                            
                            <CustomText size={14} color={colors.grey_d}>Best parties</CustomText>
                        </View>
                        
                        <View style={{ marginTop: 10 }}>
                            {renderHorizontal(parties, renderPopularItem)}
                        </View>
                        
                        <View style={{marginLeft: 0.05*width}}>
                            <View
                                style={{ width: 0.9*width,flexDirection:'row',justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={20}>Trending Users</CustomText>
                                <TouchableOpacity
                                >
                                    <CustomText size={14} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                                
                            </View>
                            <CustomText size={14} color={colors.grey_d}>Last week</CustomText>
                        </View>
                        
                        <View style={{marginTop: 10,}}>
                            {renderHorizontal(users, renderUser)}
                        </View>

                        <View style={{marginLeft: 0.05*width}}>
                            <View style={{ width: 0.9*width, flexDirection:'row', justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={20}>Parties</CustomText>
                                <TouchableOpacity>
                                    <CustomText size={14} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                            </View>
                            <CustomText size={14} color={colors.grey_d}>110 results found</CustomText>
                        </View>
                        
                    </View>
                }
            />
        ) 
    }

        
    if(isLocation && isUsers && isParties){
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: colors.background,
            }}>

                    {renderFlatlist(parties)}                    
                
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