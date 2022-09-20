import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';

import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './theme/ThemeProvider';

import { CurrentUserProvider } from './currentUser/CurrentUserProvider';

//Firebase
import { auth } from "./firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

//Stacks
import DrawerStack from './navigation/DrawerStack';
import LoginStack from './navigation/LoginStack';


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


const getFonts = () => Font.loadAsync({
    'inspiration': require('./assets/fonts/Inspiration-Regular.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf')
  });


export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
      if(user) {
          setIsUser(true)
      }
      else setIsUser(false)
      })
  }, [])

  


  if(fontsLoaded){
    return (
      <AppearanceProvider>
        <ThemeProvider>
          <CurrentUserProvider>
            <NavigationContainer> 
              <StatusBar
                  backgroundColor="#fff"
                  barStyle="dark-content" // Here is where you change the font-color
              />

              {isUser ? <DrawerStack/> : <LoginStack/> }

            </NavigationContainer> 
          </CurrentUserProvider>
        </ThemeProvider>
      </AppearanceProvider>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={()=> setFontsLoaded(true)}
        onError={() => console.log('error')}
      />
    )
  }
}