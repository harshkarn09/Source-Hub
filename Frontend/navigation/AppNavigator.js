import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import HomePage from '../components/HomePage';
import GeneralHelpScreen from '../components/GeneralHelpScreen'; // Import GeneralHelpScreen
import SubmittedRequestPage from '../components/SubmittedRequestPage';
import MarketingScreen from '../components/MarketingHelpForm';
import LostAndFoundScreen from '../components/LostAndFoundScreen';
import ViewLostAndFoundScreen from '../components/ViewLostAndFoundScreen';
import PaymentScreen from '../components/PaymentScreen';
const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="GeneralHelp" component={GeneralHelpScreen} />
      <Stack.Screen name="SubmittedRequestPage" component={SubmittedRequestPage} />
      <Stack.Screen name="MarketingScreen" component={MarketingScreen} />
      <Stack.Screen name="LostAndFoundScreen" component={LostAndFoundScreen} />
      <Stack.Screen name="ViewLostAndFoundScreen" component={ViewLostAndFoundScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
