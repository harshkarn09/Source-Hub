import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

function HelpRequestsScreen() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://192.168.1.5:5000/api/help');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.category}>{item.category}</Text>
            <Text>{item.description}</Text>
            <Text>Tags: {item.tags.join(', ')}</Text>
            {item.attachments.map((file, index) => (
              <Text key={index} style={styles.fileText}>
                Attachment {index + 1}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  requestItem: { padding: 15, backgroundColor: '#fff', marginBottom: 10 },
  category: { fontWeight: 'bold', marginBottom: 5 },
  fileText: { color: 'blue', marginTop: 5 },
});

export default HelpRequestsScreen;