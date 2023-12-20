import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Medicine = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Medicine Tracking Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});

export default Medicine;
