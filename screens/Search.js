import React, {useState, useEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';

//Hooks
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';

//Location
import * as Location from "expo-location"

//Firebase
import { db, auth } from '../firebase/firebase-config'
import { collection, query, where, getDoc, getDocs, collectionGroup, limit } from "firebase/firestore";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useParties } from '../currentUser/PartiesProvider';


export default function Search({navigation}){


    const width = Dimensions.get('window').width;

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const {colors} = useTheme();

    const { parties, setParties } = useParties();

    const [search, setSearch] = useState('');

    const [users, setUsers] = useState([])
    //const [parties, setParties] = useState([])
    const [isParties, setIsParties] = useState(false)

    const [location, setLocation] = useState(null);
    const [isLocation, setIsLocation] = useState(false);

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
        getLocation();
    }, [])


    const CATEGORIES = [
        {
            id: 1,
            title: 'Parties',
            icon: 'beer-outline'
        },
        {
            id: 2,
            title: 'Meetings',
            icon: 'people-outline'
        },
        {
            id: 3,
            title: 'Transport',
            icon: 'car-outline'
        },
        {
            id: 4,
            
            title: 'Games',
            icon: 'american-football-outline'
        },
        {
            id: 5,
            title: 'Others',
            icon: 'earth-outline'
        },
    ]

    const [selectedId, setSelectedId] = useState(1);

    const CategoryItem = ({ item, onPress, backgroundColor, textColor}) => (
        <TouchableOpacity 
            onPress={onPress}
            style={{
                height: 60,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor
            }}
        >
            <Ionicons style={{marginBottom: 5}} name={item.icon} size={25} color={textColor} />
            <CustomText size={12} color={textColor} weight={item.id == selectedId ? 'bold' : 'regular'} >{item.title}</CustomText>
        </TouchableOpacity>
      );


    const renderCategoryItem = ({ item }) => {
    
        return (
          <CategoryItem
            item={item}
            onPress={() => setSelectedId(item.id)}
            backgroundColor={ colors.background }
            textColor={ item.id == selectedId ? colors.text : colors.grey_d }
          />
        );
    };

    const renderFlatlist = (data) => {
        return(
            <FlatList
                data={data}
                renderItem={({item}) => <FlatListItem item={item} location={location} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                        
                    <View style={{marginBottom: 20}}>

                    </View>

                }
            />
        ) 
    }
    
if(isLocation){
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
        }}>

            <View
                style={{
                    height: 60,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                }}    
            >
                <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
                
            {renderFlatlist(parties)}
            
        </View>
    );
}
else{
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
        </View>
    )
}
}

