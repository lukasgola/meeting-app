import * as React from 'react';

import * as Location from "expo-location"


export const CurrentLocationContext = React.createContext({
    currentLocation: {
        latitude: 50,
        longitude: 18
    },
    setCurrentLocation: () => {}
});

export const CurrentLocationProvider = (props) => {

    const [currentLocation, setCurrentLocation] = React.useState({})
    const [isLocation, setIsLocation] = React.useState(false)

    const getLocation = async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        setIsLocation(true)
    };
    

    // Listening to changes of device appearance while in run-time
    React.useEffect(() => {
        getLocation();
    }, []);

    const location = {
        currentLocation,
        setCurrentLocation: setCurrentLocation
    }

  return (
        <CurrentLocationContext.Provider value={location}>
            {props.children}
        </CurrentLocationContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useCurrentLocation = () => React.useContext(CurrentLocationContext);
