import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, LayoutAnimation} from 'react-native';



//Components
import CustomText from '../components/CustomText';
import FlatListItem from '../components/FlatListItem';

//Providers
import {useTheme} from '../theme/ThemeProvider';
import { useCurrentLocation } from '../providers/CurrentLocationProvider';

//Firebase
import { db } from '../firebase/firebase-config'
import { getDocs, collectionGroup, where, query } from "firebase/firestore";

import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Search({navigation}){

    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const { currentLocation } = useCurrentLocation();

    const [parties, setParties] = useState();
    const [filteredData, setFilteredData] = useState();

    const [ data, setData ] = useState();

    

    const CATEGORIES = [
        {
            title: 'all',
            icon: 'beer-outline'
        },
        {
            title: 'parties',
            icon: 'beer-outline'
        },
        {
            title: 'meetings',
            icon: 'people-outline'
        },
        {
            title: 'transport',
            icon: 'car-outline'
        },
        {
            title: 'games',
            icon: 'american-football-outline'
        },
        {
            title: 'others',
            icon: 'earth-outline'
        },
    ]

    const [selectedValue, setSelectedValue] = useState('all')

    const getParties = async () => {

        const collectionRef = collectionGroup(db, "parties");
        let q = query(collectionRef);
        if (selectedValue != 'all'){
            q = query(collectionRef, where("category", "==", selectedValue));
        }
        
        const querySnapshot = await getDocs(q);

        const temp = [];
        
        querySnapshot.forEach((doc) => { 

            temp.push({
                ...doc.data(),
                id: doc.id,
                organizer: doc.ref.parent.parent.id
            })
        });
        setParties(temp);
        setFilteredData(temp);
        setData(2);
    }
    

    useLayoutEffect(() => {
        navigation.setOptions({
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            obscureBackground: false,
            placeholder: 'Search',
            onChangeText: (event) => {
              searchFilterFunction(event.nativeEvent.text, parties);
              LayoutAnimation.configureNext(layoutAnimConfig)
            },
          },
        });
    }, [data, navigation]);
    
      const layoutAnimConfig = {
        duration: 300,
        update: {
          type: LayoutAnimation.Types.easeInEaseOut, 
        },
        delete: {
          duration: 100,
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      };
    
      function searchFilterFunction(text, parties) {
        if(text){ 
            const newData = parties.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            
            setFilteredData(newData);
        } else {
            setFilteredData(parties);
        }
        
      }

    useEffect(() => {
        getParties();
    }, [selectedValue])


    const CategoryItem = ({item}) => {

        const textColor = item.title == selectedValue ? colors.text : colors.grey_d 

        return (
            <TouchableOpacity 
            onPress={() =>  setSelectedValue(item.title)}
            style={{
                height: 60,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background
            }}
        >
            <Ionicons style={{marginBottom: 5}} name={item.icon} size={25} color={textColor} />
            <CustomText size={12} color={textColor} weight={item.title == selectedValue ? 'bold' : 'regular'} >{item.title}</CustomText>
        </TouchableOpacity>
        )
        
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
            paddingHorizontal: '5%'
        }}>

            <View
                style={{
                    height: 60,
                    width: width,
                    position: 'absolute',
                    top: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                }}    
            >
                <FlatList
                    data={CATEGORIES}
                    renderItem={({item}) => <CategoryItem item={item}/>}
                    keyExtractor={(item) => item.title}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <FlatList
                data={filteredData}
                renderItem={({item}) => <FlatListItem item={item} location={currentLocation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{marginTop: 10}}>

                    </View>
                }
                ListEmptyComponent={
                    <View
                        style={{
                            paddingTop: height/3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CustomText>No events yet</CustomText>
                    </View>
                }
            />
            
        </View>
    );
}

