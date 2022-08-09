import React from 'react';
import { TextInput, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTheme} from '../theme/ThemeProvider';

const CustomTextInput = (props) => {

    const {colors} = useTheme();

    const fontFamily = props.weight == 'bold' ? 'Montserrat-Bold' : props.weight == 'light' ? 'Montserrat-Light' : 'Montserrat-Regular';


  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.color,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View
        style={{
          width: '10%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Ionicons name={props.icon} size={props.size+4} color={colors.grey_d}/>
      </View>
      
      <TextInput 
        style={{
          width: '90%',
          height: '100%',
          fontFamily: fontFamily,
          fontSize: props.size,
          color: colors.text,
        }}

        value={props.value}
        onChangeText={props.onChangeText}

        placeholder={props.placeholder}
        placeholderTextColor={colors.grey_d}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
    
  );
}

export default CustomTextInput;