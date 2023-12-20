import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AppProvider } from "./helpers/Context";
import HomeScreen from "./components/Homescreen";
import Food from "./components/Food";
import Diapers from "./components/Diapers";
import Medicine from "./components/Medicine";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Food" component={Food} />
          <Stack.Screen name="Diapers" component={Diapers} />
          <Stack.Screen name="Medicine" component={Medicine} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
