import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../firebase/firebase';

const auth = getAuth(firebaseApp);

const HomeScreen = ({ navigation }) => {
  function logout() {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  }
  return (
    <View>
      <Text>Home Screen</Text>
      <Button onPress={logout} title="logout" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
