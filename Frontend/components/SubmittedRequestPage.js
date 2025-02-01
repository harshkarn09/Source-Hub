import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Image, StyleSheet, View } from 'react-native';

const SubmittedRequestPage = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://192.168.1.5:5000/api/help'); // Adjust the URL as needed
        const data = await response.json();

        if (response.ok) {
          setRequests(data.data); // Set the requests into state
        } else {
          throw new Error(data.message || 'Failed to fetch requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Help Requests</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading requests...</Text>
      ) : (
        requests.map((request, index) => {
          // Ensure tags are properly formatted (array or JSON parsed if needed)
          const parsedTags = Array.isArray(request.tags) ? request.tags : JSON.parse(request.tags);

          return (
            <View key={index} style={styles.requestContainer}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.text}>{request.description}</Text>

              <Text style={styles.label}>Category:</Text>
              <Text style={styles.text}>{request.category}</Text>

              <Text style={styles.label}>Tags:</Text>
              <Text style={styles.text}>
                {parsedTags.length > 0 ? parsedTags.join(', ') : 'No tags available'}
              </Text>

              <Text style={styles.label}>Attachments:</Text>
              {request.attachments && Array.isArray(request.attachments) && request.attachments.length > 0 ? (
                request.attachments.map((file, index) => (
                  <React.Fragment key={index}>
                    <Text style={styles.text}>{file}</Text>
                    {/* Display image if file is an image */}
                    {file.includes('jpg') || file.includes('png') ? (
                      <Image source={{ uri: `http://192.168.1.5:5000${file}` }} style={styles.image} />
                    ) : null}
                  </React.Fragment>
                ))
              ) : (
                <Text style={styles.text}>No attachments available</Text>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f7fa',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7f8c8d',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: '#34495e',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    resizeMode: 'cover',
  },
  requestContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
});

export default SubmittedRequestPage;
