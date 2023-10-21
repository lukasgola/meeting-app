import React from 'react'
import {View} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';

const MapMarker = ({marker, selectedPlaceId}) => {

    const {colors} = useTheme();

  return (
    
        <View
            style={{
                width: 20,
                height: 20,
                backgroundColor: colors.grey,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View
                style={{
                    width: 13,
                    height: 13,
                    backgroundColor: selectedPlaceId == marker.id ? colors.primary : colors.text,
                    borderRadius: 6.5,
                }}
            >

            </View>
        </View>
  )
}


export default MapMarker;