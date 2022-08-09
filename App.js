import 'react-native-gesture-handler';
import React, {useState} from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';

import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './theme/ThemeProvider';

import AppStack from './navigation/AppStack';


//Amplify
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports'
Amplify.configure(awsconfig);


const getFonts = () => Font.loadAsync({
    'inspiration': require('./assets/fonts/Inspiration-Regular.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf')
  });


export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);


  if(fontsLoaded){
    return (
      <AppearanceProvider>
        <ThemeProvider>
        <NavigationContainer> 

          <AppStack/>

        </NavigationContainer> 
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