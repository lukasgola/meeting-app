import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';


import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTheme} from '../theme/ThemeProvider'


import CustomText from './CustomText';

const CustomMultilineInput = ({
  defaultValue,
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  size,
  color,
  icon,
  keyboardType,
  multiline
}) => {

  const {colors} = useTheme();

  const fontFamily = 'Montserrat-Regular';

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: color,
              borderRadius: 10,
              borderColor: error ? 'red' : '#e8e8e8',
              borderWidth: 1,

            }}
          >
              
              <TextInput

                style={{
                  width: '90%',
                  height: '100%',
                  fontFamily: fontFamily,
                  fontSize: size,
                  color: colors.text,
                  padding: 10
                }}
                value={value}
                defaultValue={defaultValue}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={colors.grey_d}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={'top'}
              />
          </View>
          {error && (
            <View style={{width: '100%'}}>
              <CustomText color='red'>{error.message || 'Error'}</CustomText>
            </View>
            
          )}
        </>
      )}
    />
  );
};

export default CustomMultilineInput;