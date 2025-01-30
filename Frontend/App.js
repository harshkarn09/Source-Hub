// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

// Polyfill for setImmediate if needed
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (callback) => {
    setTimeout(callback, 0);
  };
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
