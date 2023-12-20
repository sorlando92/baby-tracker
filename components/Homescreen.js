// HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppContext } from "../helpers/Context";

const HomeScreen = ({ navigation }) => {
  const { appData } = useAppContext();
  const foodData = appData.food;
  const babyData = appData.baby;
  const diaperData = appData.diapers;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{babyData.name}</Text>
        <Text style={styles.headerSubtitle}>{babyData.ageWeeks} weeks old</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Food")}>
          <Text style={styles.buttonText}>Food</Text>
          <Text style={styles.buttonSubText}>
            {foodData.totalAmount} oz in {foodData.totalSessions} sessions
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Diapers")}>
          <Text style={styles.buttonText}>Diapers</Text>
          <View style={styles.diaperTotalText}>
            {diaperData.wet > 0 && <Text>{`Wet: ${diaperData.wet}`}</Text>}
            {diaperData.dirty > 0 && <Text>{`Dirty: ${diaperData.dirty}`}</Text>}
            {diaperData.mixed > 0 && <Text>{`Mixed: ${diaperData.mixed}`}</Text>}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Medicine")}>
          <Text style={styles.buttonText}>Medicine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    padding: 20,
    backgroundColor: "skyblue",
  },
  headerContainer: {
    width: "100%",
    alignItems: "left",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 18,
  },
  buttonContainer: {
    alignSelf: "stretch",
    marginVertical: 10,
  },
  button: {
    alignSelf: "stretch",
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  diaperTotalText: {
    alignItems: "flex-end",
  },
});

export default HomeScreen;
