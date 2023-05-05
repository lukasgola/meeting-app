import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

//Hooks
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

//Providers
import { useCurrentUser } from '../providers/CurrentUserProvider';
import { useCurrentLocation } from '../providers/CurrentLocationProvider';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';


//Map
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

//Firestore
import { db, app } from '../firebase/firebase-config'
import { collection, getDocs, collectionGroup } from "firebase/firestore";

export default function Main(){

    const width = Dimensions.get('window').width;

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const {colors} = useTheme();
    const navigation = useNavigation();

    const { currentUser, setCurrentUser } = useCurrentUser();
    const { currentLocation, setCurrentLocation } = useCurrentLocation();
    
    const [users, setUsers] = useState([]);
    const [parties, setParties] = useState([]);


    const mapSettings = colors.background == '#FFFFFF' ? mapSettingsLight : mapSettingsDark;

    const [errorMsg, setErrorMsg] = useState(null);

    const isEvent = false;


    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));

        const users = [];

        querySnapshot.forEach((doc) => {
            users.push({
                ...doc.data(),
                id: doc.id,
                
              });
              
        });
        setUsers(users);
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
    },[parties])


    const renderPopularItem = ({item}) => {
        return(
            <PopularItem item={item} navigation={navigation} />
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
                renderItem={({item}) => <FlatListItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{width: width}}
            />
        ) 
    }

    const renderSubtitleSection = (text1, text2) => {
        return(
            <View style={{width: width*0.9, marginLeft: width*0.05 }}>
                <View style={{ width: 0.9*width, flexDirection:'row', justifyContent: 'space-between' }}>
                    <CustomText weight='bold' size={h2}>{text1}</CustomText>
                    <TouchableOpacity
                    >
                        <CustomText size={h4} color={colors.primary}>Show All</CustomText>
                    </TouchableOpacity>
                    
                </View>
                
                <CustomText size={h4} color={colors.grey_d}>{text2}</CustomText>
            </View>
        )
    }

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.background
        }}>

            <View style={{ width: width, marginVertical: 20}}>
                <View style={{width: width*0.9, marginLeft: width*0.05 }}>
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
                        onPress={() => navigation.navigate('Map', { location: currentLocation, isEvent})}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        scrollEnabled={false}
                    />
                </View>

                {renderSubtitleSection('Popular Near You', 'Best parties')}

                {parties ? 
                
                    <View style={{ marginTop: 10 }}>
                        {renderHorizontal(parties, renderPopularItem)}
                    </View>

                    : 
                    
                    <View style={{width: '100%', height: 200, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator />
                    </View>
                }
                
                
                {renderSubtitleSection('Trending Users', 'Last week')}

                {users ? 
                
                    <View style={{marginTop: 10}}>
                        {renderHorizontal(users, renderUser)}
                    </View>

                    : 
                    
                    <View style={{width: '100%', height: 160, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator />
                    </View>
                }
            </View>
        </View>
    )
    
}