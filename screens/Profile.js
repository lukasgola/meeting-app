import React, {} from 'react';
import {View, Dimensions, ScrollView, TouchableOpacity, ImageBackground, FlatList} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';
import UserIcon from '../components/UserIcon';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useCurrentUser } from '../currentUser/CurrentUserProvider'
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Profile(){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const navigation = useNavigation();
    const route = useRoute();

    const user = route.params.user;

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
                source={{uri: user.avatar}} 
                resizeMode="cover" 
                blurRadius={2}
                opac
                style={{width: width, height: 200}}>
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.25)'}}></View>
            </ImageBackground>
            <View style={{
                width: width,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                backgroundColor: colors.background,
                marginTop: -100,
                alignItems: 'center'
            }}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EditProfile')}
                    style={{
                        width: 104,
                        height: 104,
                        borderRadius: 52,
                        marginTop: -50,
                        backgroundColor: colors.background,
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
                    
                }}>
                    <UserIcon size={100} photo={user.avatar} score={user.score} />
                </TouchableOpacity>
                <View style={{alignItems: 'center', height: 80, justifyContent: 'space-around', paddingVertical: 5, marginTop: 10}}>
                    <CustomText weight='bold' size={20} >{user.username}</CustomText>
                    <CustomText >{user.email}</CustomText>
                </View>
                <View style={{width: width, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                    <TouchableOpacity 
                            style={{
                                width: 80, 
                                height: 40, 
                                borderRadius: 20, 
                                backgroundColor: colors.background, 
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
                            }}>
                            <Ionicons name='chatbubbles-outline' size={25} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            width: 100, 
                            height: 40, 
                            borderRadius: 20, 
                            backgroundColor: colors.primary, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            shadowColor: colors.primary,
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 0.4,
                            shadowRadius: 5.84,

                            elevation: 8,
                        }}>
                        <CustomText weight='bold' color={colors.background}>FOLLOW</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            width: 80, 
                            height: 40, 
                            borderRadius: 20, 
                            backgroundColor: colors.background, 
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
                        }}>
                        <Ionicons name='share-outline' size={25} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <View 
                    style={{
                        width: width, 
                        height: 90, 
                        flexDirection: 'row', 
                        marginTop: 25, 
                        justifyContent: 'space-around', 
                        borderColor: colors.grey_l, 
                        borderTopWidth: 1,
                        borderBottomWidth: 1
                    }}>
                    <View style={{width: width*0.3, height: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20}}>
                        <CustomText weight='bold' size={20}>{user.score}</CustomText>
                        <CustomText color={colors.grey_d}>Score</CustomText>
                    </View>
                    <View style={{width: width*0.3, height: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20}}>
                        <CustomText weight='bold' size={20}>123</CustomText>
                        <CustomText color={colors.grey_d}>Followers</CustomText>
                    </View>
                    <View style={{width: width*0.3, height: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20}}>
                        <CustomText weight='bold' size={20}>123</CustomText>
                        <CustomText color={colors.grey_d}>Following</CustomText>
                    </View>
                </View>

                <View style={{width: width}}>
                    <View
                        style={{marginLeft: 20, marginTop: 20}}>
                        <CustomText weight='bold' size={16}>Last events</CustomText>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginTop: 10
                        }}
                    >
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
                            style={{
                                marginTop: 10
                            }}
                        />
                    </View>
                </View>
                
                <View style={{width: width, alignItems: 'center', padding: 20}}>
                    <View
                        style={{width: '100%'}}>
                        <CustomText weight='bold' size={16}>About me</CustomText>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginTop: 10
                        }}
                    >
                        <CustomText color={colors.grey_d}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to</CustomText>
                    </View>
                </View>

                <View style={{width: width}}>
                    <View
                        style={{marginLeft: 20}}>
                        <CustomText weight='bold' size={16}>Followers</CustomText>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            marginTop: 10,
                            marginBottom: 50
                        }}
                    >
                        <FlatList
                            data={data}
                            renderItem={({item}) => (
                                <View
                                    style={{
                                        width: 60,
                                        marginLeft: 20,
                                    }}
                                >
                                    <UserIcon size={60} photo={user.avatar} score={user.score} />
                                </View>
                            )
                            }
                            keyExtractor={(item) => item.id}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{
                                marginTop: 10
                            }}
                        />
                    </View>
                </View>
                
            
            </View>
            
        </ScrollView>
    );
}