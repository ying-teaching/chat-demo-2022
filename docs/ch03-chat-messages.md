# Chapter 3: Chat Messages

In this chapter we let a user see all chat messages and input new message.

## 1 Chat Screen

A user clicks on a chat name in home screen and navigate to the chat screen. Create a basic `screens/ChatScreen.js` and add the screen to navigation stack in `App.js`.

Change `components/ChatListItem.js` to add a `enterChat` prop and call this function when an list item is clicked. The code snippet is as the following:

```js
const ChatListItem = ({ id, chatName, enterChat }) => {
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)}>
    ...
}
```

In `screens/HomeScreen.js`, create `enterChat` function and pass it as a prop of the `ChatListItem`. The code is as the following:

```js
function enterChat(id, chatName) {
  navigation.navigate('Chat', { id, chatName });
}

function createItem(chat) {
  const {
    id,
    data: { chatName },
  } = chat;

  return (
    <ChatListItem
      key={id} // to suppress the warning of list item key
      id={id}
      chatName={chatName}
      enterChat={enterChat}
    />
  );
}
```

In the navigation code `navigation.navigate('Chat', { id, chatName });`, we pass two route parameters: `id` and `chatName`.

## 2 Customize Chat Header

First install two used packages `yarn add react-native-reanimated react-native-gesture-handler`. These will be used later in user input.

To make it looks better, we customize the Chat Screen header as the following:

```js
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

  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
```

## 3 Input Chat Message

The message input and its styles are implemented as the following:

```js
return (
  <SafeAreaView>
    <StatusBar style="light" />

    <KeyboardAvoidingView>
      <TouchableWithoutFeedback>
        <ScrollView></ScrollView>

        <View style={styles.footer}>
          <TextInput style={styles.TextInput} />
          <TouchableOpacity activeOpacity={0.5}>
            <Ionicons name="send" size={24} color="#2B68E6" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

// ...

const styles = StyleSheet.create({
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
    backgroundColor: 'lightgray',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
});
```

## 4 Send Chat Message

When a user clicks the the send icon, the app calls `sendMessage` function to send the chat message to Firestore.

We import and intialize Firestore as the following:

```js
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
```

Then define the `sendMessage` function as the following:

```js
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
```

Finally, create the `TextInput` and call `sendMessage` when the send icon is clicked.

```js
<TextInput
  style={styles.textInput}
  onSubmitEditing={sendMessage}
  placeholder="Chat Message"
  onChangeText={setInput}
/>
<TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
  <Ionicons name="send" size={24} color="blue" />
</TouchableOpacity>
```

## 5 Query and Display Messages

Here we want to display all messages ordered by their timestamp. The query is defeind as the following:

```js
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
```

The function `showMessage` shows each message in the `<ScrollView>` view.

We also change the title avatar to the last message's user avatar. It is just a two-line change: one for avatar `uri: messages[messages.length - 1]?.data.photoURL,` and one for depenency array `[navigation, messages]`.

## 6 Display Chat List
