import React, {useState, useEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';

//Amplify
import { API, graphqlOperation } from 'aws-amplify'
import { listUsers, listEvents } from '../src/graphql/queries';

//Location
import * as Location from "expo-location"



export default function Main({navigation}){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const [users, setUsers] = useState([])
    const [isUsers, setIsUsers] = useState()

    const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState([])

    const [location, setLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(null);
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

    useEffect(() => {
        
        const fetchUsers = async () => {
            try{

                const usersResult = await API.graphql(
                    graphqlOperation(listUsers)
                )

                setUsers(usersResult.data.listUsers.items);
                setIsUsers(true)
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
                setIsParties(true)
            }catch (e){
                console.log(e);
            }
        }

        fetchParties();
        getLocation();
    }, [])


    const renderPopularItem = ({item}) => {
        return(
            <PopularItem item={item} navigation={navigation} user={users[0]} location={location} />
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
                renderItem={({item}) => <FlatListItem item={item} navigation={navigation} user={users[0]} location={location} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{ width: '100%', marginVertical: 20 }}>

                        <View style={{ marginLeft: 0.05*width }}>
                            <View style={{ width: 0.9*width, flexDirection:'row' }}>
                                <CustomText weight='bold' size={25}>Welcome</CustomText>
                                <CustomText weight='bold' size={25} color={colors.primary}> lukasgola</CustomText>
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
                                <Image 
                                    style={{width: '100%', height: '100%', borderRadius: 10, borderWidth: 1, borderColor: colors.grey_l}}
                                    resizeMethod='resize' 
                                    resizeMode='cover' 
                                    source={require('../assets/images/map.jpg')} />
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
