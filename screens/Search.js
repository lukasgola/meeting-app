import React, {useState, useEffect} from 'react';
import {View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';
import CustomTextInput from '../components/CustomTextInput';

import FlatListItem from '../components/FlatListItem';
import PopularItem from '../components/PopularItem';
import TrendingUser from '../components/TrendingUser';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Search({navigation}){


    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const [search, setSearch] = useState('');

    const [users, setUsers] = useState([])
    const [parties, setParties] = useState([])

    useEffect(() => {
        
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


    const renderPopularItem = ({item}) => {
        return(
            <PopularItem item={item} navigation={navigation} user={users[0]} />
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
                renderItem={({item}) => <FlatListItem item={item} navigation={navigation} user={users[0]} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{
                    
                }}
                ListHeaderComponent={
                    <View style={{ width: '100%', marginVertical: 20 }}>
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
                            {renderHorizontal(data, renderPopularItem)}
                        </View>

                        <View style={{marginLeft: 0.05*width}}>
                            <View style={{ width: 0.9*width }}>
                                <CustomText weight='bold' size={20}>Parties</CustomText>
                            </View>
                            <CustomText size={14} color={colors.grey_d}>110 results found</CustomText>
                        </View>
                        
                    </View>
                }
            />
        ) 
    }

    const renderList = () => {
        if(selectedId == 1){
            return(
                renderFlatlist(parties)
            )
        }
        else if(selectedId == 2){
            return(
                renderFlatlist(parties)
            )
        }
    }
    

    return (
            <View style={{
                flex: 1,
                backgroundColor: colors.background,
            }}>

                <View
                    style={{
                        width: '100%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 5,
                        paddingHorizontal: '2.5%'
                    }}
                >
                    <CustomTextInput 
                        value={search}
                        setValue={setSearch}
                        placeholder='Wyszukaj'
                        size={12} 
                        color={colors.grey_l} 
                        icon={'search-outline'}
                    />

                    

                </View>
                
                <View
                    style={{
                        height: 60,
                        
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.10,
                        shadowRadius: 2.84,

                        elevation: 6,
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
                

                <View
                    style={{
                        flex: 1,
                    }}
                >

                    {renderList()}

                </View>
                
            </View>
    );
}



const styles = StyleSheet.create({
    card:{
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        marginRight: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 2.84,

        elevation: 6,
    },
    card_main:{
        width: '100%',
        height: 100,
        flexDirection: 'row',
    },
    card_main_image_view:{
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card_main_image: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    card_main_info:{
        height: 100,
        marginLeft: 10,
    },
    card_main_info_row:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 5
    },
    card_footer:{
        width: '100%',
        height: 50,
        flexDirection: 'row',
    },
    card_footer_half:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card_footer_half_content:{
        width: '80%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    }
    
})