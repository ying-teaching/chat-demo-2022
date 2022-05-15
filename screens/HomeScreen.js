import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Avatar, Text } from '@rneui/base';

import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../firebase/firebase';

const auth = getAuth(firebaseApp);

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat Home',
      headerStyle: { backgroundColor: 'white' },
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              onPress={logout}
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
            ></Avatar>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  function logout() {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  }
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
