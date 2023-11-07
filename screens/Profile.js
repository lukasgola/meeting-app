import React, { useState, useEffect } from 'react';
import {View, Dimensions, ScrollView, TouchableOpacity, ImageBackground, FlatList, StyleSheet} from 'react-native';

//Hooks
import {useTheme} from '../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCurrentUser } from '../providers/CurrentUserProvider';

//Components
import CustomText from '../components/CustomText';
import UserIcon from '../components/UserIcon';


import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Profile(){

    const width = Dimensions.get('window').width;

    const h1 = 25
    const h2 = 20
    const h3 = 16
    const h4 = 14

    const {colors} = useTheme();
    const { currentUser } = useCurrentUser();

    const navigation = useNavigation();
    const route = useRoute();

    const data = [
        {
            id: 1
        },
        {
            id: 2
        },
        {
            id: 3
        }
    ]



    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.grey_l }}>
            <ImageBackground 
                source={{uri: currentUser.avatar}} 
                resizeMode="cover" 
                blurRadius={2}
                opac
                style={{width: width, height: 200}}>
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.25)'}}></View>
            </ImageBackground>
            <View style={[styles.content,{backgroundColor: colors.background}]}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Avatar')}
                        style={[styles.avatar, {backgroundColor: colors.background}]}>
                        <UserIcon size={100} avatar={currentUser.avatar} score={currentUser.score} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.buttons_container}>
                    <CustomText weight='bold' size={h2} >{currentUser.username}</CustomText>
                    <CustomText >{currentUser.email}</CustomText>
                </View>
                <View style={{width: width, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                    <TouchableOpacity 
                        style={[styles.side_button,{backgroundColor: colors.background}]}
                    >
                            <Ionicons name='chatbubbles-outline' size={25} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.follow_button,{backgroundColor: colors.primary, shadowColor: colors.primary}]}
                    >
                        <CustomText weight='bold' color={colors.background}>FOLLOW</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.side_button,{backgroundColor: colors.background}]}>
                        <Ionicons name='share-outline' size={25} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <View 
                    style={[styles.data_container, {borderColor: colors.grey_l,}]}>
                    <View style={styles.single_data}>
                        <CustomText weight='bold' size={20}>{currentUser.score}</CustomText>
                        <CustomText color={colors.grey_d}>Score</CustomText>
                    </View>
                    <View style={styles.single_data}>
                        <CustomText weight='bold' size={20}>123</CustomText>
                        <CustomText color={colors.grey_d}>Followers</CustomText>
                    </View>
                    <View style={styles.single_data}>
                        <CustomText weight='bold' size={20}>123</CustomText>
                        <CustomText color={colors.grey_d}>Following</CustomText>
                    </View>
                </View>

                <View style={{width: '100%'}}>
                    <View style={{marginLeft: 20, marginTop: 20}}>
                        <CustomText weight='bold' size={h3}>Last events</CustomText>
                    </View>
                    <View style={{width: '100%', marginTop: 10}}>
                        <FlatList
                            data={data}
                            renderItem={({item}) => (
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        marginLeft: 20,
                                        backgroundColor: colors.grey_l,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Ionicons name='bonfire-outline' size={25} color={colors.primary} />
                                </View>
                            )
                            }
                            keyExtractor={(item) => item.id}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
                
                <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 20, marginTop: 20}}>
                    <View style={{width: '100%'}}>
                        <CustomText weight='bold' size={h3}>About me</CustomText>
                    </View>
                    <View style={{width: '100%', marginTop: 10}}>
                        <CustomText color={colors.grey_d}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to</CustomText>
                    </View>
                </View>

                <View style={{marginLeft: 20, marginTop: 20}}>
                    <CustomText weight='bold' size={h3}>Followers</CustomText>
                </View>
                <View style={{width: '100%',marginTop: 10,marginBottom: 50}}>
                    <FlatList
                        data={data}
                        renderItem={({item}) => (
                            <View style={{marginLeft: 20 }}>
                                <UserIcon size={60} photo={currentUser.avatar} score={currentUser.score} />
                            </View>
                        )
                        }
                        keyExtractor={(item) => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                
            
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -100,
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
        marginTop: -50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5.84,

        elevation: 8,
    },
    buttons_container: {
        alignItems: 'center', 
        height: 80, 
        justifyContent: 'space-around', 
        paddingVertical: 5, 
        marginTop: 10
    },
    side_button: {
        width: 80, 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5.84,

        elevation: 8,
    },
    follow_button: {
        width: 100, 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5.84,

        elevation: 8,
    },
    data_container: {
        width: '100%', 
        height: 90, 
        flexDirection: 'row', 
        marginTop: 25, 
        justifyContent: 'space-around', 
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    single_data: {
        width: '30%', 
        height: '100%', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        paddingVertical: 20
    }
})