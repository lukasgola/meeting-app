import React, { useState } from 'react';
import {View, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import {useForm} from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

//Components
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';

//Image Picker
import * as ImagePicker from 'expo-image-picker';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { uploadImage, auth } from '../firebase/firebase-config'

export default function Avatar() {

    const width = Dimensions.get('window').width;

    const {colors} = useTheme();
    const navigation = useNavigation();

    const [avatar, setAvatar] = useState(null)

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const submit = () => {
        uploadImage(auth.currentUser.uid, avatar);
    }

  return (
    <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: colors.background }}>
        <View style={{ width: 0.9*width }}>
            <View style={{ width: '100%', height: 180, justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity 
                    onPress={() => pickImage()}
                    style={{width: 100, height: 100, borderRadius: 50, backgroundColor: colors.grey_l, justifyContent: 'center', alignItems: 'center'}}>
                    {avatar == null ? 
                        <Ionicons name='person-circle-outline' size={60} color={colors.grey_d} /> : 
                        <Image style={{
                            position: 'absolute',
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                        }} source={{ uri: avatar }} />
                    }
                    
                </TouchableOpacity>
                <CustomText color={colors.grey_d} weight='light' size={14}>Click to choose your profile picutre</CustomText>
            </View>
            <TouchableOpacity 
                onPress={() => submit()}
                style={{ 
                    width: '100%', 
                    height: 50, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: 20,
                    borderRadius: 10,
                    backgroundColor: colors.primary
                }}>
                <CustomText weight='bold' size={18} color={'white'}>Set Profile Picture</CustomText>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => submit()}
                style={{ 
                    width: '100%', 
                    height: 50, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: 20,
                    borderRadius: 10,
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.grey
                }}>
                <CustomText weight='bold' size={18} color={colors.text}>Later</CustomText>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  )
}
