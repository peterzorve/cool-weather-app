import React, { useState}  from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// https://www.weatherapi.com/docs/


// import LoginScreen from './src/screens/LoginScreen';
// import AdminButtonNavScreen from './src/screens/AdminButtonNavScreen';
// import WeatherScreen from './src/screens/weather/WeatherScreen';
// import ProfitsScreens from './src/screens/ProfitsScreens';
import ProfitsScreens from '../components/screens/weather/CopScreen';
import WeatherScreen from '../components/screens/weather/WeatherScreen';

import * as Font from 'expo-font';


const Stack = createNativeStackNavigator()

export default function App() { 

        // ==============================================================================================================================================================
        const [fontLoaded, setFontLoaded] = useState(false);
        const loadFontAsync = async () => {
          await Font.loadAsync({
            "JosefinSans-Bold": require("../assets/fonts/josefinSans/JosefinSans-Bold.ttf"),
            "JosefinSans-Light": require("../assets/fonts/josefinSans/JosefinSans-Light.ttf"),
            "JosefinSans-Regular": require("../assets/fonts/josefinSans/JosefinSans-Regular.ttf"),
            "JosefinSans-SemiBold": require("../assets/fonts/josefinSans/JosefinSans-SemiBold.ttf"),
            "JosefinSans-Thin": require("../assets/fonts/josefinSans/JosefinSans-Thin.ttf"),
    
            "Kanit-Bold": require("../assets/fonts/kanit/Kanit-Bold.ttf"),
            "Kanit-Light": require("../assets/fonts/kanit/Kanit-Light.ttf"),
            "Kanit-Regular": require("../assets/fonts/kanit/Kanit-Regular.ttf"),
            "Kanit-SemiBold": require("../assets/fonts/kanit/Kanit-SemiBold.ttf"),
            "Kanit-Thin": require("../assets/fonts/kanit/Kanit-Thin.ttf"),    
          });
          setFontLoaded(true);
        };
        if (!fontLoaded) {
          loadFontAsync();
          return null; 
        }
      
    return (
        // <NavigationContainer>    
              <View style={styles.container}>
                  <Stack.Navigator screenOptions={{ headerBackTitle: "Back",   }}>
                      <Stack.Screen name="ProfitsScreens" component={ProfitsScreens}  options={ ({route}) => ({ title: "", headerShown: false})}   />
                      <Stack.Screen name="WeatherScreen" component={WeatherScreen}  options={ ({route}) => ({ title: "", headerShown: false})}   />
                      {/* <Stack.Screen name="AdminButtonNav" component={AdminButtonNavScreen}  options={ ({route}) => ({ title: "Create an account"})}   /> */}
                      {/* <Stack.Screen name="Login"          component={LoginScreen}           options={ ({route}) => ({ title: "Sign Up Screen: ", headerShown: false})} /> */}
                      
                  </Stack.Navigator>
              <StatusBar style="auto" />
            </View>
        // </NavigationContainer>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
