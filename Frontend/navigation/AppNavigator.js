import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import HomePage from '../components/HomePage';
import GeneralHelpScreen from '../components/GeneralHelpScreen'; // Import GeneralHelpScreen

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="GeneralHelp" component={GeneralHelpScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
