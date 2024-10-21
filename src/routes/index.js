// In App.js in a new project

import * as React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Local Imports
import HomeScreen from '../screens/Home/index'
import HistoryScreen from '../screens/History';
import LandingScreen from '../screens/Landing';
import { Header } from 'react-native/Libraries/NewAppScreen';


const Stack = createNativeStackNavigator();

// function LogoTitle() {
//   return (
//     <Image
//       style={{ width: 45, height: 45 }}
//       source={require('../assets/images/Student-Engagement.png')}
//     />
//   );
// }

function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerShown: false, // Hide the default header
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen}  options={{ title: 'Result' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;