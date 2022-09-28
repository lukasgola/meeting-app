import React, {useState, useEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, TouchableHighlight } from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

import { useCurrentUser } from '../currentUser/CurrentUserProvider'

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
import { db, auth } from '../firebase/firebase-config'
import { collection, query, where, getDoc, getDocs, collectionGroup, limit, orderBy } from "firebase/firestore";


export default function Main(){

    const width = Dimensions.get('window').width;

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const {colors} = useTheme();
    const navigation = useNavigation();

    const currentUser  = useCurrentUser();

    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;


    const [users, setUsers] = useState([])
    const [isUsers, setIsUsers] = useState(false)

    const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState(false)

    const [location, setLocation] = useState({
        latitude: 50,
        longitude: 40
    });
    const [isLocation, setIsLocation] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);


    const isEvent = false;


    const getLocation = async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        
        let location = await Location.getCurrentPositionAsync({});
        console.log('elo')
        setLocation(location.coords);
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
        setParties([]);
        //getLocation();
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
                renderItem={({item}) => <FlatListItem item={item} location={location} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{ width: '100%', marginVertical: 20 }}>

                        <View style={{ marginLeft: 0.05*width }}>
                            <View style={{ width: 0.9*width, flexDirection:'row' }}>
                                <CustomText weight='bold' size={h1}>Welcome</CustomText>
                                <CustomText weight='bold' size={h1} color={colors.primary}> {currentUser.username}</CustomText>
                            </View>
                            <CustomText size={h4} color={colors.text}>Check out the map</CustomText>
                                
                            <MapView 
                                style={{
                                    width: 0.9*width,
                                    height: 120,
                                    borderRadius: 10,
                                    marginTop: 10,
                                    marginBottom: 20,
                                }}
                                initialRegion={{
                                    latitude: 50.5107,
                                    longitude: 18.30056,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                provider={PROVIDER_GOOGLE}
                                onPress={() => navigation.navigate('Map', {location, isEvent})}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                scrollEnabled={false}
                            />

                            
                        </View>
                        

                        <View style={{ marginLeft: 0.05*width }}>
                            <View
                                style={{ width: 0.9*width, flexDirection:'row', justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={h2}>Popular Near You</CustomText>
                                <TouchableOpacity
                                >
                                    <CustomText size={h4} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                                
                            </View>
                            
                            <CustomText size={h4} color={colors.grey_d}>Best parties</CustomText>
                        </View>
                        
                        <View style={{ marginTop: 10 }}>
                            {renderHorizontal(parties, renderPopularItem)}
                        </View>
                        
                        <View style={{marginLeft: 0.05*width}}>
                            <View
                                style={{ width: 0.9*width,flexDirection:'row',justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={h2}>Trending Users</CustomText>
                                <TouchableOpacity
                                >
                                    <CustomText size={h4} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                                
                            </View>
                            <CustomText size={h4} color={colors.grey_d}>Last week</CustomText>
                        </View>
                        
                        <View style={{marginTop: 10,}}>
                            {renderHorizontal(users, renderUser)}
                        </View>

                        <View style={{marginLeft: 0.05*width}}>
                            <View style={{ width: 0.9*width, flexDirection:'row', justifyContent: 'space-between' }}>
                                <CustomText weight='bold' size={20}>Parties</CustomText>
                                <TouchableOpacity>
                                    <CustomText size={h4} color={colors.primary}>Show All</CustomText>
                                </TouchableOpacity>
                            </View>
                            <CustomText size={h4} color={colors.grey_d}>110 results found</CustomText>
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