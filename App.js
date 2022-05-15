import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerStyle: { backgroundColor: 'dodgerblue' }, // Style object for header, only support backgroundColor.
  headerTitleStyle: { color: 'white' }, // Style object for header title
  headerTintColor: 'white', // the color of back button and title
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          ></Stack.Screen>
          <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
