import React, { useLayoutEffect, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Avatar } from '@rneui/base';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';

import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseApp from '../firebase/firebase';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const ChatScreen = ({ navigation, route }) => {
  const { chatName, id } = route.params;
  const [input, setInput] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',

      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar
            rounded
            source={{
              uri: 'https://www.gstatic.com/mobilesdk/180227_mobilesdk/database_rules_zerostate.png',
            }}
          ></Avatar>
          <Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>
            {chatName}
          </Text>
        </View>
      ),

      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            width: 80,
            justifyContent: 'space-between',
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  function sendMessage() {
    Keyboard.dismiss();
    const chatMessages = collection(db, 'chats', id, 'messages');
    addDoc(chatMessages, {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
    });
    setInput('');
  }

  return (
    <SafeAreaView>
      <StatusBar style="light" />

      <KeyboardAvoidingView>
        <TouchableWithoutFeedback>
          <ScrollView></ScrollView>

          <View style={styles.footer}>
            <TextInput
              style={styles.TextInput}
              onSubmitEditing={sendMessage}
              placeholder="Chat Message"
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  TextInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
});
