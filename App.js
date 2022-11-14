import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrightScreen from './src/screens/BrightScreen';
import DarkScreen from './src/screens/DarkScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="Registration" component={RegistrationScreen} /> */}
        <Stack.Screen name="Bright" component={BrightScreen} />
        <Stack.Screen name="Dark" component={DarkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}