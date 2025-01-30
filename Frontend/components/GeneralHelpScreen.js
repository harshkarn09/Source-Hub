import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for camera functionality
import * as FileSystem from 'expo-file-system'; // Import FileSystem

function GeneralHelpScreen() {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coding');
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Function to pick a file (from file system)
  const handleFilePick = async () => {
    console.log("Opening file picker...");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [DocumentPicker.types.allFiles],
      });

      if (result.type === 'success') {
        console.log("File picked:", result);
        setAttachments(result.uri ? [result.uri] : []); // Store file URIs
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('Error picking file:', err);
      }
    }
  };

  // Function to pick an image from the camera
  const handleCameraPick = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setAttachments([...attachments, result.uri]); // Add camera image to attachments
      }
    } else {
      Alert.alert('Permission required', 'Camera permission is required to take a photo.');
    }
  };

  // Log the document directory of the app
  const getDocumentsDirectory = async () => {
    const dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    console.log("Documents Directory:", dir); // Logs files inside the app's document directory
  };

  // Call the function to log the directory
  useEffect(() => {
    getDocumentsDirectory();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('category', category);

    tags.forEach(tag => formData.append('tags', tag));

    attachments.forEach((fileUri, index) => {
      const file = {
        uri: fileUri,
        name: `file-${index}`,
        type: 'application/octet-stream',  // Update the MIME type if needed (e.g., 'application/pdf' for PDFs)
      };
      formData.append('attachments', file);
    });

    try {
      const response = await fetch('http://192.168.1.5:5000/api/help', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Help Request Submitted', data.message);
        setDescription('');
        setTags([]);
        setAttachments([]);
      } else {
        Alert.alert('Error', data.message || 'Failed to submit help request');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Help</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your help request"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      {/* Attach file button */}
      <TouchableOpacity style={styles.button} onPress={handleFilePick}>
        <Text style={styles.buttonText}>Attach Files</Text>
      </TouchableOpacity>

      {/* Use camera button */}
      <TouchableOpacity style={styles.button} onPress={handleCameraPick}>
        <Text style={styles.buttonText}>Use Camera</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category (coding, college related, miscellaneous)"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Tags (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tags"
        value={tags.join(', ')}
        onChangeText={(text) => setTags(text.split(',').map(tag => tag.trim()))}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff' },
  button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginVertical: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
});

export default GeneralHelpScreen;
