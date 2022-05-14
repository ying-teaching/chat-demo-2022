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

In `App.js`, we import `SafeAreaProvider` and use it as the root element. It helps to handle safe area (the top part) for all all platforms. We use the `NavigationContainer` to wrap content and use the stack navigator to switch between login and register screens. First, install the native stack navigator library.

- `yarn add @react-navigation/native-stack`

Because a stack navigator uses screens as its child components, we first create `LoginScreen.js` and a `RegisterScreen.js` in `screens` folder. In VS Code, use `rnfes` (react native function export with style) code emmet to generate the contents.

In `App.js`, create a stack navigatior to wrap the two screens. After adding screen options, the code is as following:

```js
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

### 1.2 Login Screen

A registered user types email and password to login. First time user should register first. To let a user input with a virtual keyboard, the login screen uses a [`<KeyboardAvoidingView>`](https://reactnative.dev/docs/keyboardavoidingview) to automatically adjust its position based on the keyboard height. Its document recommends setting its `behavior` property.

Because we use a light style color theme in the app, we can set the status bar to a light one using `<StatusBar style="light" />`.

[React Native Elements](https://reactnativeelements.com/) is a popular UI toolkit that provides cross platform UI elements such as `<Input>`, `<Button>` etc. Run the following commands to to install the toolkit and its dependencies.

- `yarn add react-native-vector-icons`
- `yarn add @rneui/themed @rneui/base`

Then we add an image, two inputs (email and password), two buttons (login and register), one empty `View` to fill the bottom space and their styles, the `screens/LoginScreen.js` is as following:

```js
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from '@rneui/base';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
        }}
        style={{ width: 200, height: 200 }}
      />

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button title="Login" containerStyle={styles.button} />
      <Button
        title="Register"
        type="outline"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.button}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: { width: 300 },
  button: {
    width: 200,
    marginTop: 10,
  },
});
```

When a user presses the `Register` button, the app navigates to the register screen. The login function is to be implemented when we setup a Firebase account and project.

### 1.3 Register Screen

Similar to the login screen, we create a register screen to let new user to register. The `useEffect` hook is used to change the default `headerBackTitle` for `iOS` devices -- it doesn't work for Android and Web. The screen UI code is as following:

```js
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Text } from '@rneui/base';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back to Login', //iOS only
    });
  }, [navigation]);

  function register() {
    // to be implemented after backend setup
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Chat Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          onChangeText={setName}
        />
        <Input placeholder="Eamil" type="email" onChangeText={setEmail} />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          onChangeText={setPassword}
        />
        <Input
          placeholder="Profile Pic URL"
          type="text"
          onChangeText={setImageUrl}
          onSubmitEditing={register}
        />
      </View>
      <Button
        style={styles.button}
        title="Register"
        raised
        onPress={register}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
});
```

As shown in the code, the `register` funciton is to be implemented after backend setup.
