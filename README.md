# Chat App Demo

This is chat app demo based on the Youtube video [Let's build SIGNAL with REACT NATIVE](https://youtu.be/MJzmZ9qmdaE). Two major changes are 1) bug fixes and 2) May 2022 versions of React Native and Expo tools. The development has three phases:

- Login and Register
- Home Screen and Sign out
- Chat and Messages

## 1 Login and Register

### 1.1 Initialization

Run `expo init my-chat -t blank` to intialize a project named as `my-chat`. Change the name if you like a different one. Run `yarn web` to check that the app is up and running in your browser.

The chat app uses [React Navigation](https://reactnavigation.org/docs/getting-started/). Follow its document to install navigation packages using the following commands:

- `yarn add @react-navigation/native`
- `expo install react-native-screens react-native-safe-area-context`

In `App.js` we import the `NavigationContainer` component and use it to wrap content. We use the stack navigator to switch between login and register screens. First, install the native stack navigator library.

- `yarn add @react-navigation/native-stack`

Because a stack navigator uses screens as its child components, we first create `LoginScreen.js` and a `RegisterScreen.js` in `screens` folder. In VS Code, use `rnfes` (react native function export with style) code emmet to generate the contents.

In `App.js`, create a stack navigatior to wrap the two screens. Following is the code:

```js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerStyle: { backgroundColor: 'dodgerblue' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: { color: 'white' },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```
