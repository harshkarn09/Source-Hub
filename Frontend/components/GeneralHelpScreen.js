import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Image } from 'react-native';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDocumentPick = async () => {
    try {
      console.log('Opening file picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', '*/*'], // Ensure images and other files are selectable
        copyToCacheDirectory: true, // Ensure file URI is accessible
      });
  
      console.log('Picker result:', result);
  
      if (result.canceled) {
        console.log('File picker canceled');
        return;
      }
  
      const selectedFile = result.assets?.[0]; // Ensure we're accessing assets correctly
  
      if (!selectedFile) {
        console.log('No file selected');
        return;
      }
  
      const file = {
        uri: selectedFile.uri,
        name: selectedFile.name || `file_${Date.now()}`,
        type: selectedFile.mimeType || 'application/octet-stream',
        id: new Date().toISOString(),
      };
  
      console.log('File selected:', file);
  
      setAttachments((prevAttachments) => {
        if (prevAttachments.length < 5) {
          return [...prevAttachments, file];
        } else {
          Alert.alert('Error', 'You can only select up to 5 files');
          return prevAttachments;
        }
      });
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'File picker error');
    }
  };
  
  

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Description cannot be empty');
      return;
    }
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags.join(','));
  
    // Only append files if any are selected
    attachments.forEach((file) => {
      formData.append('attachments', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });
  
    try {
      setIsSubmitting(true);
      const response = await fetch('http://192.168.98.89:5000/api/help', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Request submitted successfully');
        setDescription('');
        setCategory('coding');
        setTags([]);
        setAttachments([]); // Clear attachments
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const renderAttachmentItem = ({ item }) => (
    <View style={styles.attachmentItem}>
      {item.type.startsWith('image/') ? (
        <Image
          source={{ uri: item.uri }}
          style={styles.imagePreview}
          onError={() => console.log('Image load error')}
        />
      ) : (
        <View style={styles.filePreview}>
          <Text style={styles.fileTypeText}>
            {item.type.split('/')[1]?.toUpperCase() || 'FILE'}
          </Text>
        </View>
      )}
      <Text style={styles.attachmentName} numberOfLines={1}>
        {item.name}
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveAttachment(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Help Request</Text>

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Describe your request in detail"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Category Picker */}
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
        dropdownIconColor="#666"
      >
        <Picker.Item label="Coding" value="coding" />
        <Picker.Item label="Networking" value="networking" />
        <Picker.Item label="Hardware" value="hardware" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {/* Tags Section */}
      <View style={styles.tagContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add tags (press enter to add)"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addTagButton}
          onPress={handleAddTag}
          disabled={!tagInput.trim()}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tags List */}
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

      {/* Attachments Section */}
      <View style={styles.attachmentSection}>
        <Text style={styles.sectionTitle}>Attachments ({attachments.length}/5):</Text>

        <TouchableOpacity
          style={styles.fileButton}
          onPress={handleDocumentPick}
          disabled={attachments.length >= 5}
        >
          <Text style={styles.buttonText}>
            {attachments.length >= 5 ? 'Max files reached' : 'Add File'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={attachments}
          keyExtractor={(item) => item.id}
          renderItem={renderAttachmentItem}
          contentContainerStyle={styles.attachmentsList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No files selected</Text>
          }
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '', // Light background for better contrast
 // Light background for better contrast
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  addTagButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#e8f4fd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  attachmentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  fileButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attachmentsList: {
    paddingBottom: 10,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  filePreview: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#f1c40f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
  },
});



export default HelpRequestForm;
