import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

//Hooks
import {useTheme} from '../theme/ThemeProvider';

//Components
import CustomText from '../components/CustomText';

export default function Chats(){

    const {colors} = useTheme();

    const containerStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
  };

    return (
            <View style={containerStyle}>
                <CustomText size={30}>Chats</CustomText>
            </View>
    );
}