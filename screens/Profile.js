import React, {} from 'react';
import {View, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

import CustomText from '../components/CustomText';
import UserIcon from '../components/UserIcon';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useCurrentUser } from '../currentUser/CurrentUserProvider'
import { useNavigation } from '@react-navigation/native';


export default function Profile(){

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();

    const navigation = useNavigation();

    const h2 = 16;

    const currentUser  = useCurrentUser();


    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.grey_l }}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('EditProfile')}
                style={{
                    width: 30,
                    height: 30,
                    backgroundColor: colors.background,
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.40,
                        shadowRadius: 4.84,
                
                        elevation: 6,
            }}>
                <Ionicons name='color-wand-outline' size={16} color={colors.text} />
            </TouchableOpacity>
            <View style={{
                width: width,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                marginTop: -100,
                backgroundColor: colors.background,
                marginTop: 100,
                alignItems: 'center'
            }}>
                <View style={{
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
                        height: 10,
                    },
                    shadowOpacity: 0.40,
                    shadowRadius: 4.84,
            
                    elevation: 6,
                    
                }}>
                    <UserIcon size={100} photo={currentUser.avatar} score={currentUser.score} />
                </View>
                <View style={{alignItems: 'center', height: 80, justifyContent: 'space-around', paddingVertical: 5, marginTop: 10}}>
                    <CustomText weight='bold' size={20} >{currentUser.username}</CustomText>
                    <CustomText >{currentUser.email}</CustomText>
                </View>
                <View style={{width: width, alignItems: 'center', marginTop: 20}}>
                    <TouchableOpacity style={{width: 100, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center'}}>
                        <CustomText weight='bold' color={colors.background}>FOLLOW</CustomText>
                    </TouchableOpacity>
                </View>
                <View style={{width: width, height: 100, flexDirection: 'row', marginTop: 10, justifyContent: 'space-around'}}>
                    <View style={{width: width*0.3, height: '100%', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20}}>
                        <CustomText weight='bold' size={20}>{currentUser.score}</CustomText>
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
                <View style={{width: width, alignItems: 'center', padding: 20}}>
                    <View
                        style={{width: '100%'}}>
                        <CustomText weight='bold' size={h2}>About me</CustomText>
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
                
            
            </View>
            
        </ScrollView>
    );
}