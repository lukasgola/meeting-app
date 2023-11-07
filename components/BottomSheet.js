import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, Modal, KeyboardAvoidingView, Text, TouchableOpacity, Animated, Pressable } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import * as Haptics from 'expo-haptics';

import { BlurView } from 'expo-blur';


import {useTheme} from '../theme/ThemeProvider';

const BottomSheet = (props) => {


    const leftValue = useState(new Animated.Value(-500))[0];

    const {colors} = useTheme();

    function slideIn(){
        Animated.spring(leftValue,{
            toValue: 20,
            duration: 400,
            useNativeDriver: false
        }).start()
    }

    const firstUpdate = useRef(false);

    function slideOut(){
        Animated.spring(leftValue,{
            toValue: -1000,
            duration: 500,
            useNativeDriver: false
        }).start()

        setTimeout(() => {
            props.setModalVisible(false)
        }, 100)
    }
    
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = true;
        }
        else {
            if(props.visible){
                slideIn();
            }
        }
    });


    const onConfirm = () => {
        //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          )
        setTimeout(() => {
            slideOut();
        }, 50)
        props.onConfirm();
        
   }

    const onCancel = () => {
        slideOut();
    }


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
    >
        <BlurView 
            intensity={20} 
            tint='dark'
            style={{
                flex: 1,
            }}
        >
            <Pressable 
                onPress={() => slideOut()}
                style={{
                    flex: 1     
            }}>
            </Pressable>
        </BlurView>

        <Animated.View style={{
            width: '95%',
            position: 'absolute',
            bottom: leftValue,
            left: '2.5%',
            //zIndex: 10,
        }}>

        

        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >   
            <View style={{
                backgroundColor: colors.background,
                flex: 1,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingHorizontal: '5%',
                paddingVertical: 10,
            }}>
                
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colors.text,
                    }}>{props.text}</Text>
                    <TouchableOpacity onPress={() => slideOut()}>
                        <Ionicons name={'close-circle-outline'} size={30} style={{marginLeft: 3}} color={colors.text} />
                    </TouchableOpacity>
                </View>
                
                    {props.children}
                
            </View>
            

            <View
                style={{
                    backgroundColor: colors.background,
                    width: '100%',
                    height: 60,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    borderTopWidth: 1,
                    borderTopColor: colors.grey_l
                }}
            >
                <TouchableOpacity 
                    onPress={() => onConfirm()}
                    activeOpacity={0.2}
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: colors.primary
                    }}>Wybierz</Text>
                </TouchableOpacity>
            </View>
            
            <View
                style={{
                    backgroundColor: colors.background,
                    width: '100%',
                    height: 60,
                    borderRadius: 15,
                    marginTop: 5
                }}
            >
                <TouchableOpacity 
                    onPress={() => onCancel()}
                    activeOpacity={0.2}
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: colors.primary,
                        fontWeight: 'bold'
                    }}>Anuluj</Text>
                </TouchableOpacity>
            </View>
        
        </KeyboardAvoidingView>
        </Animated.View>
  </Modal>
  );
}

export default BottomSheet;