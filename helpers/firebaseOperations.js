import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db = getFirestore(app);

export const addDiaperEntry = async (entry) => {
  try {
    const docRef = await addDoc(collection(db, "diaper"), entry);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const deleteDiaperEntry = async (id) => {
  try {
    await deleteDoc(doc(db, "diaper", id));
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

export const getDiaperEntries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "diaper"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

export const addFoodEntry = async (entry) => {
  try {
    const docRef = await addDoc(collection(db, "food"), entry);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getFoodEntries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "food"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

export const deleteFoodEntry = async (id) => {
  try {
    await deleteDoc(doc(db, "food", id));
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

// TODO - consider the ability to edit an entry
export const updateFoodEntry = async (id, updatedEntry) => {
  try {
    await updateDoc(doc(db, "food", id), updatedEntry);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
