import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, Modal, KeyboardAvoidingView, Text, TouchableOpacity, Animated, Pressable } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import LottieView from 'lottie-react-native';

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

    const globalAnimation = useRef(null);
    const extendValue = useRef(new Animated.Value(0)).current;
    const [ lottieSize, setLottieSize ] = useState(0);

    function extend(){
        Animated.spring(extendValue,{
            toValue: 100,
            duration: 400,
            useNativeDriver: false
        }).start()
        setLottieSize(60);
    } 
    function fold(){
        Animated.spring(extendValue,{
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start()
        setLottieSize(0);
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
        extend();
        globalAnimation.current.play();
        setTimeout(() => {
            fold();
            setTimeout(() => {
                slideOut();
            }, 50)
        }, 700)
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
            

            <Animated.View style={{
                height: extendValue,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 10,
                backgroundColor: colors.background
            }}>
                <LottieView
                    ref={globalAnimation}
                    style={{
                        width: lottieSize,
                        height: lottieSize,
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('../assets/confirm_anim.json')}
                    loop={false}
                    speed={3}
                />
            </Animated.View>
            

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