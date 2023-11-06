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

//Map
import mapSettingsLight from '../data/mapSettingsLight';
import mapSettingsDark from '../data/mapSettingsDark';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


import { getParties } from '../functions/getParties';

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

    const isEvent = false;


    const fetchParties = async () => {
        try {
            const result = await getParties('all'); // Call the async function
            setParties(result);
          } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
        
    
    
    useEffect(() => {       
        fetchParties();
    }, []);



    const renderFlatlist = (data) => {
        return(
            <FlatList
                data={data}
                renderItem={({item}) => <FlatListItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{marginHorizontal: -0.05*width}}
            />
        ) 
    }

    const SubtitleSection = ({text1, text2}) => {
        return(
            <View style={{width: '100%', paddingBottom: 10}}>
                <View style={{ width: '100%', flexDirection:'row', justifyContent: 'space-between' }}>
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
            backgroundColor: colors.container,
            paddingHorizontal: '5%'
        }}>

            <View style={{ width: '100%', flexDirection:'row', marginTop: 20 }}>
                <CustomText weight='bold' size={h1}>Welcome</CustomText>
                <CustomText weight='bold' size={h1} color={colors.primary}> {currentUser.username}</CustomText>
            </View>
            <CustomText size={h4} color={colors.text}>Check out the map</CustomText>
                
            <MapView 
                style={{
                    width: '100%',
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
                //provider={PROVIDER_GOOGLE}
                customMapStyle={mapSettings}
                onPress={() => navigation.navigate('Map', {isQuickLaunch: true})}
                zoomEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
            />

            <SubtitleSection text1={'Popular Near You'} text2={'Best parties'} />
            
            {renderFlatlist(parties)}
        </View>
    )
    
}