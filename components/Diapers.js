import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTime, formatDate, formatDateTime, castDateTimeAsTimeStamp } from "../helpers/utilityHelpers";
import { addDiaperEntry, deleteDiaperEntry, getDiaperEntries } from "../helpers/firebaseOperations";
import { useAppContext } from "../helpers/Context";

const Diapers = () => {
  const [dateTime, setDateTime] = useState(formatDateTime(new Date()));
  const [notes, setNotes] = useState("");
  const [diaperType, setDiaperType] = useState("Wet");
  const [diaperEntries, setDiaperEntries] = useState([]);
  const [diaperEntryTotal, setDiaperEntryTotal] = useState({ wet: 0, dirty: 0, mixed: 0 });
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const { updateCategoryData } = useAppContext();

  useEffect(() => {
    const fetchEntries = async () => {
      const entries = await getDiaperEntries();
      if (entries) {
        setDiaperEntries(
          entries.sort((a, b) => {
            const dateA = new Date(a.when.toDate());
            const dateB = new Date(b.when.toDate());

            return dateB - dateA;
          })
        );
        updateDiaperTotals(entries);
      }
    };

    fetchEntries();
  }, []);

  const handleDiaperTypeChange = (type) => {
    setDiaperType(type);
  };

  const handleDateTimeChange = (event, selectedDateTime) => {
    const currentDateTime = selectedDateTime || new Date();
    setShowDateTimePicker(false);
    setDateTime(formatDateTime(currentDateTime));
  };

  const handleSubmit = async () => {
    const newEntry = {
      diaperType: diaperType.toLowerCase(),
      notes: notes,
      when: castDateTimeAsTimeStamp(dateTime),
    };

    try {
      const docId = await addDiaperEntry(newEntry);
      const updatedEntries = [...diaperEntries, { ...newEntry, id: docId }];
      setDiaperEntries(updatedEntries);
      updateDiaperTotals(updatedEntries);

      // reset State
      setNotes("");
      setDateTime(formatDateTime(new Date()));
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding entry");
    }
  };

  const handleDelete = async (id) => {
    await deleteDiaperEntry(id);
    const updatedEntries = diaperEntries.filter((entry) => entry.id !== id);
    setDiaperEntries(updatedEntries);
    updateDiaperTotals(updatedEntries);
  };

  const updateDiaperTotals = (enteries) => {
    let wet = 0;
    let dirty = 0;
    let mixed = 0;

    for (let entry of enteries) {
      if (entry.diaperType === "wet") {
        wet++;
      } else if (entry.diaperType === "dirty") {
        dirty++;
      } else if (entry.diaperType === "mixed") {
        mixed++;
      } else {
        console.error("diaperType not found: ", entry.diaperType);
      }
    }

    setDiaperEntryTotal({
      wet: wet,
      dirty: dirty,
      mixed: mixed,
    });

    updateCategoryData("diapers", { wet: wet, dirty: dirty, mixed: mixed });
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{`Wet: ${diaperEntryTotal.wet} Dirty: ${diaperEntryTotal.dirty} Mixed: ${diaperEntryTotal.mixed}`}</Text>
      </View>

      <View style={styles.buttonGroup}>
        {["Wet", "Dirty", "Mixed"].map((type) => (
          <TouchableOpacity key={type} style={[styles.button, diaperType === type && styles.buttonActive]} onPress={() => handleDiaperTypeChange(type)}>
            <Text style={diaperType === type ? styles.textActive : styles.text}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} value={dateTime} placeholder="Select Date and Time" onFocus={() => setShowDateTimePicker(true)} />
      {showDateTimePicker && <DateTimePicker value={new Date()} mode="datetime" display="default" onChange={handleDateTimeChange} />}

      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Notes" multiline />
      <Button title="Submit" onPress={handleSubmit} />

      <FlatList
        data={diaperEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <View style={styles.textContainer}>
              <Text>{`${formatDate(item.when.toDate())} at ${formatTime(item.when.toDate())}`}</Text>
              <Text>{`Type: ${item.diaperType.charAt(0).toUpperCase() + item.diaperType.slice(1)}`}</Text>
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
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  button: {
    padding: 10,
    width: "33%",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonActive: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  text: {
    color: "black",
  },
  textActive: {
    color: "white",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  buttonDelete: {
    backgroundColor: "#AA4A44",
    maxHeight: 50,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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

export default Diapers;
