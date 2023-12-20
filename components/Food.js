import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTime, formatDate, formatDateTime, castDateTimeAsTimeStamp } from "../helpers/utilityHelpers";
import { getFoodEntries, addFoodEntry, deleteFoodEntry } from "../helpers/firebaseOperations";
import { useAppContext } from "../helpers/Context";

const Food = () => {
  const [dateTime, setDateTime] = useState(formatDateTime(new Date()));
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const { updateCategoryData } = useAppContext();

  useEffect(() => {
    const fetchEntries = async () => {
      const entries = await getFoodEntries();
      if (entries) {
        updateAmountSession(entries);
        setFoodEntries(
          entries.sort((a, b) => {
            const dateA = new Date(a.when.toDate());
            const dateB = new Date(b.when.toDate());

            return dateB - dateA;
          })
        );
      }
    };

    fetchEntries();
  }, []);

  const handleSubmit = async () => {
    if (!isNaN(amount) && amount !== "") {
      const newEntry = {
        amount: amount,
        notes: notes,
        when: castDateTimeAsTimeStamp(dateTime),
      };
      try {
        const docId = await addFoodEntry(newEntry);

        const updatedEntries = [...foodEntries, { ...newEntry, id: docId }];
        setFoodEntries(updatedEntries);
        updateAmountSession(updatedEntries);
        setDateTime(formatDateTime(new Date()));
        setAmount("");
        setNotes("");
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding entry");
      }
    } else {
      alert("Please enter a valid amount");
    }
  };

  const handleDelete = async (id) => {
    await deleteFoodEntry(id);
    const updatedEntries = foodEntries.filter((entry) => entry.id !== id);
    setFoodEntries(updatedEntries);
    updateAmountSession(updatedEntries);
  };

  const updateAmountSession = (entries) => {
    const total = entries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);
    const sessions = entries.length;

    setTotalAmount(total);
    setTotalSessions(sessions);
    updateCategoryData("food", { totalAmount: total, totalSessions: sessions });
  };

  const handleDateTimeChange = (event, selectedDateTime) => {
    const currentDateTime = selectedDateTime || new Date();
    setShowDateTimePicker(false);
    setDateTime(formatDateTime(currentDateTime));
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {totalAmount} oz eaten in {totalSessions} sessions
        </Text>
      </View>

      <TextInput style={styles.input} value={dateTime} placeholder="Select Date and Time" onFocus={() => setShowDateTimePicker(true)} />
      {showDateTimePicker && <DateTimePicker value={new Date()} mode="datetime" display="default" onChange={handleDateTimeChange} />}

      <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Ounces" inputMode="numeric" />
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Notes" multiline />
      <Button styles={styles.button} title="Submit" onPress={handleSubmit} />

      <FlatList
        data={foodEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <View style={styles.textContainer}>
              <Text>{`${formatDate(item.when.toDate())} at ${formatTime(item.when.toDate())}`}</Text>
              <Text>{`Amount: ${item.amount} oz`}</Text>
              <Text>{item.notes}</Text>
            </View>
            <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  summary: {
    padding: 10,
    alignItems: "left",
    marginBottom: 10,
  },
  summaryText: {
    alignItems: "left",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonDelete: {
    backgroundColor: "#AA4A44",
    maxHeight: 50,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  buttonDeleteText: {
    color: "white",
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d7d7d7",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Food;
