import React, { useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
  const { requestId } = route.params; // Get requestId from navigation params
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.98.89:5000/api/marketingHelp/${requestId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Completed" }),
      });

      if (!response.ok) throw new Error("Payment Failed");

      Alert.alert("Success", "Payment Successful!");
      navigation.navigate("HomeScreen"); // Navigate back to Home

    } catch (error) {
      Alert.alert("Error", error.message || "Payment Failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Complete Your Payment</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Proceed with Payment" onPress={handlePayment} />
      )}
    </View>
  );
};

export default PaymentScreen;
