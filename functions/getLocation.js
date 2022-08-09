import * as Location from "expo-location"

const getLocation = async function() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    //alert(JSON.stringify(location))
    return location;
};


export default getLocation;