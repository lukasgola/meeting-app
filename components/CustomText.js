import React from 'react';
import { Text } from 'react-native';


import {useTheme} from '../theme/ThemeProvider';

const CustomText = (props) => {

    const {colors} = useTheme();

    const fontFamily = props.weight == 'bold' ? 'Montserrat-Bold' : props.weight == 'light' ? 'Montserrat-Light' : 'Montserrat-Regular';

  return (
    <Text 
      style={{
        fontFamily: fontFamily, 
        fontSize: props.size, 
        color: props.color ? props.color : colors.text,
        
      }}>
      {props.children}
    </Text>
  );
}

export default CustomText;