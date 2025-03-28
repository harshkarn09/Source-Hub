import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, FlatList, Alert, Image } from 'react-native';

function SubmittedRequests({ navigation }) {
  const [queryTag, setQueryTag] = useState('');
  const [helpRequests, setHelpRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [replyText, setReplyText] = useState({}); // State to handle replies input

  const backendURL = "http://192.168.98.89:5000/uploads/";

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  const fetchHelpRequests = async () => {
    try {
      const response = await fetch('http://192.168.98.89:5000/api/help');
      const data = await response.json();
      if (data && data.data) {
        setHelpRequests(data.data);
        setFilteredRequests(data.data);
      } else {
        console.error("Invalid data structure received");
      }
    } catch (error) {
      console.error('Error fetching help requests:', error);
    }
  };

  const handleTagFilter = () => {
    if (!queryTag.trim()) {
      setFilteredRequests(helpRequests); // Reset if input is empty
      return;
    }
  
    const filtered = helpRequests.filter(request => 
      request.tags &&
      Array.isArray(request.tags) &&
      request.tags.some(tag => tag.toLowerCase().includes(queryTag.trim().toLowerCase()))
    );
  
    setFilteredRequests(filtered);
  };
  

  const handleReply = async (requestId) => {
    if (!replyText[requestId]) {
      Alert.alert("Error", "Reply cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.98.89:5000/api/help/reply/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: "Anonymous", message: replyText[requestId] }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Reply added!");
        setReplyText({ ...replyText, [requestId]: "" }); // Clear reply input
        fetchHelpRequests(); // Refresh data
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      Alert.alert("Error", "Failed to add reply");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submitted Help Requests</Text>

      {/* Filter Input */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Tag"
          value={queryTag}
          onChangeText={setQueryTag}
        />
        <Button title="Filter" onPress={handleTagFilter} />
      </View>

      {/* Display Filtered Help Requests */}
      <FlatList
        data={filteredRequests || []}  // Default to an empty array if undefined
        keyExtractor={item => item._id || item.id || Math.random().toString()} // Fallback key
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <Text style={styles.requestTitle}>{item.description}</Text>
            <Text style={styles.requestCategory}>Category: {item.category}</Text>
            <Text style={styles.requestTags}>Tags: {item.tags && Array.isArray(item.tags) ? item.tags.join(', ') : 'No tags available'}</Text>

            {item.attachments && Array.isArray(item.attachments) && item.attachments.length > 0 && item.attachments.map((attachment, index) => (
              <Image
                key={index}
                source={{ uri: attachment.url }}
                style={styles.attachmentImage}
              />
            ))}

            {/* Replies Section */}
            <View style={styles.repliesContainer}>
              <Text style={styles.repliesHeader}>Replies:</Text>
              {item.replies && Array.isArray(item.replies) && item.replies.length > 0 ? (
                item.replies.map((reply, index) => (
                  <Text key={index} style={styles.replyText}>
                    {reply.user}: {reply.message}
                  </Text>
                ))
              ) : (
                <Text style={styles.noReplyText}>No replies yet.</Text>
              )}
            </View>

            {/* Reply Input */}
            <TextInput
              style={styles.replyInput}
              placeholder="Write a reply..."
              value={replyText[item._id] || ''}
              onChangeText={(text) => setReplyText({ ...replyText, [item._id]: text })}
            />
            <TouchableOpacity onPress={() => handleReply(item._id)} style={styles.replyButton}>
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  filterContainer: { flexDirection: 'row', marginBottom: 20 },
  filterInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, width: '80%' },
  requestCard: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 20, borderRadius: 8 },
  requestTitle: { fontSize: 18, fontWeight: 'bold' },
  requestCategory: { fontSize: 16, color: '#555' },
  requestTags: { fontSize: 14, color: '#777' },
  attachmentImage: { width: '100%', height: 200, marginTop: 10 },
  repliesContainer: { marginTop: 10 },
  repliesHeader: { fontSize: 16, fontWeight: 'bold' },
  replyText: { fontSize: 14, marginTop: 5 },
  noReplyText: { fontSize: 14, color: '#aaa' },
  replyInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 10 },
  replyButton: { backgroundColor: '#007BFF', padding: 10, marginTop: 10, borderRadius: 5 },
  replyButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#f44336', borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});

export default SubmittedRequests;
