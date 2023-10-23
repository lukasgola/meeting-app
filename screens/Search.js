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
import { getDocs, collectionGroup } from "firebase/firestore";

import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Search({navigation}){


    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const {colors} = useTheme();

    const [parties, setParties] = useState();
    const [filteredData, setFilteredData] = useState();

    const [ data, setData ] = useState();

    const { currentLocation } = useCurrentLocation();

    const getParties = async () => {

        const querySnapshot = await getDocs(collectionGroup(db, "parties"));

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
    

    useEffect(() => {
        getParties();
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
          headerSearchBarOptions: {
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
                renderItem={({item}) => <FlatListItem item={item} location={currentLocation} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{marginBottom: 20}}>
                    </View>
                }
                ListEmptyComponent={
                        
                    <View
                        style={{
                            flex: 1,
                            paddingTop: height/3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CustomText>No events yet</CustomText>
                    </View>
                    
                    
                }
            />
        ) 
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
        }}>
                
            {renderFlatlist(filteredData)}

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
            
        </View>
    );
}

