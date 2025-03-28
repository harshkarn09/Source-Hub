import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";

const MarketingHelpForm = () => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const navigation = useNavigation();

  // 📌 Pick Image
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Accept images
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setImage(result.assets[0]); // Store image details
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // 📌 Submit Form
  const handleSubmit = async () => {
    if (!description || !price || !image) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("price", price);
    formData.append("paymentMethod", paymentMethod);
    formData.append("image", {
      uri: image.uri,
      type: image.mimeType || "image/jpeg",
      name: image.name || "upload.jpg",
    });

    try {
      const response = await fetch("http://192.168.98.89:5000/api/marketingHelp", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Submission failed");

      Alert.alert("Success", "Request submitted successfully!");
      navigation.navigate("PaymentScreen", { requestId: data.newHelp._id });

    } catch (error) {
      Alert.alert("Error", error.message || "Network Error");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Request Marketing Help</Text>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Select Image" onPress={handleFilePicker} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}

      <Text style={{ marginTop: 10 }}>Select Payment Method:</Text>
      <Picker selectedValue={paymentMethod} onValueChange={(item) => setPaymentMethod(item)}>
        <Picker.Item label="Credit Card" value="Credit Card" />
        <Picker.Item label="Debit Card" value="Debit Card" />
        <Picker.Item label="PayPal" value="PayPal" />
        <Picker.Item label="UPI" value="UPI" />
        <Picker.Item label="Net Banking" value="Net Banking" />
      </Picker>

      <Button title="Proceed to Payment" onPress={handleSubmit} />
    </View>
  );
};

export default MarketingHelpForm;
