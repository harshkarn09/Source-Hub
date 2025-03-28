import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';

const ViewLostAndFoundScreen = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.98.89:5000/api/lost-found');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleReplySubmit = async (itemId) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Reply cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch(`http://192.168.98.89:5000/api/lost-found/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, message: replyText, user: 'Anonymous' }),
      });
  
      const text = await response.text();
      console.log('Server Response:', text); // Debugging
  
      const data = JSON.parse(text); // Handle potential non-JSON responses
  
      if (!response.ok) throw new Error(data.error || 'Failed to submit reply');
  
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, replies: data.item.replies } : item
        )
      );
  
      setFilteredItems((prevFilteredItems) =>
        prevFilteredItems.map((item) =>
          item._id === itemId ? { ...item, replies: data.item.replies } : item
        )
      );
  
      setReplyText('');
      setSelectedItemId(null);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit reply.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lost & Found Items</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search items by description..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : filteredItems.length === 0 ? (
        <Text style={styles.emptyMessage}>No lost and found items available.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.description}>{item.description}</Text>

              {item.images && item.images.length > 0 ? (
                <ScrollView horizontal style={styles.imageContainer}>
                  {item.images.map((img, index) => (
                    <Image 
                      key={index} 
                      source={{ uri: `http://192.168.0.179:5000${img}` }} 
                      style={styles.image} 
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noImageText}>No Image Available</Text>
              )}

              <View style={styles.repliesContainer}>
                <Text style={styles.replyHeader}>Replies:</Text>
                {item.replies.length > 0 ? (
                  item.replies.map((reply, index) => (
                    <View key={index} style={styles.replyBox}>
                      <Text style={styles.replyUser}>User:</Text>
                      <Text style={styles.replyText}>{reply.message}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noReplies}>No replies yet.</Text>
                )}
              </View>

              {selectedItemId === item._id && (
                <View style={styles.replyInputContainer}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Write a reply..."
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={() => handleReplySubmit(item._id)}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedItemId === item._id ? (
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setSelectedItemId(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.replyButton} 
                  onPress={() => setSelectedItemId(item._id)}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 15 },
  searchInput: { borderWidth: 1, borderColor: '#bdc3c7', padding: 10, borderRadius: 5, backgroundColor: '#fff', marginBottom: 10 },
  emptyMessage: { textAlign: 'center', fontSize: 16, color: 'gray' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  description: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  imageContainer: { flexDirection: 'row', marginBottom: 10 },
  image: { width: 150, height: 100, borderRadius: 5, marginRight: 5 },
  noImageText: { fontSize: 14, color: 'gray' },
  repliesContainer: { marginTop: 10, backgroundColor: '#ecf0f1', padding: 8, borderRadius: 5 },
  replyHeader: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  replyBox: { backgroundColor: '#fff', padding: 6, borderRadius: 5, marginBottom: 5, borderWidth: 1, borderColor: '#dcdcdc' },
  replyUser: { fontSize: 12, fontWeight: 'bold', color: '#3498db' },
  replyText: { fontSize: 14 },
  noReplies: { fontSize: 12, color: 'gray' },
  replyButton: { backgroundColor: '#3498db', padding: 10, marginTop: 10, borderRadius: 5 },
  replyButtonText: { color: '#fff', textAlign: 'center' },
  replyInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  replyInput: { flex: 1, borderWidth: 1, borderColor: '#bdc3c7', padding: 8, borderRadius: 5, backgroundColor: '#fff' },
  submitButton: { backgroundColor: 'green', padding: 10, marginLeft: 5, borderRadius: 5 },
  submitButtonText: { color: '#fff' },
  cancelButton: { backgroundColor: 'red', padding: 10, marginTop: 10, borderRadius: 5 },
  cancelButtonText: { color: '#fff', textAlign: 'center' },
});

export default ViewLostAndFoundScreen;
