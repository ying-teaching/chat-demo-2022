import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: 'dodgerblue' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: { color: 'white' },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
