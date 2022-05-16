import React, { useEffect, useLayoutEffect, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseApp from '../firebase/firebase';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const ChatScreen = ({ navigation, route }) => {
  const { chatName, id } = route.params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    const messagesRef = collection(db, 'chats', id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, data: doc.data() });
      });
      setMessages(messages);
    });
    return unsubscribe;
  }, [route]);

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

  function showMessage({ id, data }) {
    console.log(id, data);
    if (data.displayName === auth.currentUser.displayName) {
      return (
        <View key={id} style={styles.receiver}>
          <Avatar
            rounded
            position="absolute"
            bottom={-15}
            right={-5}
            // Web
            containerStyle={{
              position: 'absolute',
              bottom: -15,
              right: -5,
            }}
            size={30}
            source={{
              uri: data.photoURL,
            }}
          />
          <Text style={styles.receiverText}>{data.message}</Text>
        </View>
      );
    } else {
      return (
        <View key={id} style={styles.sender}>
          <Avatar
            rounded
            position="absolute"
            bottom={-15}
            left={-5}
            // Web
            containerStyle={{
              position: 'absolute',
              bottom: -15,
              left: -5,
            }}
            sieze={30}
            source={{
              uri: data.photoURL,
            }}
          />
          <Text style={styles.senderText}>{data.message}</Text>
          <Text style={styles.senderName}>{data.displayName}</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            {messages.map(showMessage)}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
              style={styles.textInput}
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
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
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
  receiver: {
    padding: 15,
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    backgroundColor: '#2B68E6',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  receiverText: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 10,
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: 'white',
  },
});
