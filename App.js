import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider } from './theme/ThemeProvider';
import { CurrentUserProvider } from './providers/CurrentUserProvider';
import { CurrentLocationProvider } from './providers/CurrentLocationProvider';

//Firebase
import { auth } from "./firebase/firebase-config";

import { onAuthStateChanged } from "firebase/auth";

//Stacks
import LoginStack from './navigation/LoginStack';
import BottomTabs from './navigation/BottomTabs';
import MainStack from './navigation/MainStack';


import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};


export default function App() {

  const [fontsLoaded] = useFonts({
    'inspiration': require('./assets/fonts/Inspiration-Regular.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf')
  });

  const [isUser, setIsUser] = useState(0);

  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
      if(user) {
          setIsUser(2);
      }
      else setIsUser(1);
      })
  }, [])

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }
  

    const Indicator = () => {
      <View styles={{flex:1}}>
        <ActivityIndicator />
      </View>
    }

    return (
        <ThemeProvider>
          <CurrentUserProvider>
            <CurrentLocationProvider>
                <NavigationContainer> 
                  <StatusBar
                      backgroundColor="#fff"
                      barStyle="dark-content" // Here is where you change the font-color
                  />

                  {isUser == 2 ? <MainStack/> : isUser == 0  ? <Indicator /> : <LoginStack/> }

                </NavigationContainer>
            </CurrentLocationProvider>
          </CurrentUserProvider>
        </ThemeProvider>
    );
}