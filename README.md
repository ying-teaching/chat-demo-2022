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

### 1.4 Firebase Setup

[Firebase](https://firebase.google.com/) is an app development cloud platform provided by Google. Among many services, the [Firestore](https://firebase.google.com/docs/firestore) is a cloud database that can sync your data across all client apps in realtime. If a user send a message to the database, all users subscribed to the database can see the new message. That's exactly what we want for our chat app. Firebase has a free plan for developers with a limitation of API calls and storage size. A developer can register an account and create/setup proejcts for free.

A developer can use an existing Google account or create a new account to use Firebase. After login, go to the console the [Firebase Console](https://console.firebase.google.com/), perform the following tasks.

#### 1.4.1 Create a Porject

- Click "Add porject", type a project name. In our case, it is "Chat-2022".
- In the next screen, diable "Enable Google Analytics for this project". Google Analytics is used to collect user data in production. It is not used in this demo app.
- Click "Create project" to create the project and click "Continue" button.

### 1.4.2 Register an App

We should be in the project overview page that allows us to setup the project. In project overview page, click the Web circle marked with "</>".

- Step1, in "Register app", give a nick name. Let's call it "Chat-2022". Optionally, you can enable the "Firebase Hosting" to host a web app. Click the "Register app" button.
- Setp 2, in "Add Firebase SDK" page, it displays the initialization code used by our app. We can copy it now or check it out later. Click "Next" button.
- Step 3 is "Install Firebase CLI". Click "Next"
- Step 4 shows hosting commands, click "Continue to console"

In the project overview page, click the "1 app", then click the tool gear icon to config our app. At the bottom, it is the **SDK setup and configuration** -- same as the code shown in step 2. The code is similar to the following (we masked all sensitive code)

```js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'too sensitive to show',
  authDomain: 'blah.firebaseapp.com',
  projectId: 'blah-73826',
  storageBucket: 'blah-73826.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

### 1.4.3 Configure Authentication

Click "Authentication" on the left panel, then click "Get started" to configure "Sign-in method" for our project. Click "Email/Password". Click the first "Enable" switch and save it.
