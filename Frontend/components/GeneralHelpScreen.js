import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const HelpRequestForm = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coding');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.assets) {
        setAttachments(prev => [
          ...prev,
          {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: result.assets[0].mimeType,
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags)); // Make sure it's correctly formatted as an array
  
    attachments.forEach((file) => {
      formData.append('attachments', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });
  
    try {
      const response = await fetch('http://192.168.1.5:5000/api/help', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Request submitted successfully');
        // Pass the correct data
        navigation.navigate('SubmittedRequestPage', { requestData: data.data });
        setDescription('');
        setCategory('coding');
        setTags([]);
        setAttachments([]);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit request');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Help</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your request in detail"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
        dropdownIconColor="#666"
      >
        <Picker.Item label="Coding" value="coding" />
        <Picker.Item label="Networking" value="networking" />
        <Picker.Item label="Hardware" value="hardware" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <View style={styles.tagContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add tags (press enter to add)"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleAddTag}
        />
        <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={tags}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.tagsList}
      />

      <View style={styles.attachmentButtons}>
        <TouchableOpacity style={styles.fileButton} onPress={handleDocumentPick}>
          <Text style={styles.buttonText}>Add File</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={attachments}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.attachmentItem}>
            <Text style={styles.attachmentName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveAttachment(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#e8f4fd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tagText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  fileButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  attachmentName: {
    flex: 1,
    color: '#2c3e50',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tagsList: {
    marginBottom: 15,
  },
});

export default HelpRequestForm;
