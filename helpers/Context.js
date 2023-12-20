import React, { createContext, useState, useEffect, useContext } from "react";
import { getFoodEntries, getDiaperEntries } from "./firebaseOperations";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appData, setAppData] = useState({
    baby: { name: "Peyton", ageWeeks: 25 },
    food: { totalAmount: 0, totalSessions: 0 },
    diapers: { wet: 0, dirty: 0, mixed: 0 },
    medicine: {},
  });

  const updateCategoryData = (category, data) => {
    setAppData((prevAppData) => ({ ...prevAppData, [category]: { ...prevAppData[category], ...data } }));
  };

  useEffect(() => {
    const fetchFoodData = async () => {
      const entries = await getFoodEntries();
      const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);
      const totalSessions = entries.length;

      updateCategoryData("food", { totalAmount, totalSessions });
    };

    const fetchDiaperData = async () => {
      const entries = await getDiaperEntries();
      let wet = 0;
      let dirty = 0;
      let mixed = 0;

      for (let entry of entries) {
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

      updateCategoryData("diapers", { wet, dirty, mixed });
    };

    fetchFoodData();
    fetchDiaperData();
  }, []);

  return <AppContext.Provider value={{ appData, updateCategoryData }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
