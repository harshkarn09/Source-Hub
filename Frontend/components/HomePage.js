import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomePage({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Logged out successfully');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout failed');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('SignIn');
      }
    };
    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home Page</Text>

      {/* General Help Option */}
      <TouchableOpacity
        style={[styles.optionButton, { backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('GeneralHelp')} // Navigate to GeneralHelpScreen
      >
        <Text style={styles.optionText}>General Help</Text>
      </TouchableOpacity>

      {/* Marketing Help Option */}
      <TouchableOpacity
        style={[styles.optionButton, { backgroundColor: '#2196F3' }]}
        onPress={() => Alert.alert('Marketing Help', 'You selected Marketing Help')}
      >
        <Text style={styles.optionText}>Marketing Help</Text>
      </TouchableOpacity>

      {/* Lost and Found Option */}
      <TouchableOpacity
        style={[styles.optionButton, { backgroundColor: '#FF9800' }]}
        onPress={() => Alert.alert('Lost and Found', 'You selected Lost and Found')}
      >
        <Text style={styles.optionText}>Lost and Found</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomePage;
