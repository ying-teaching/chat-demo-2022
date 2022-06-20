# Chapter 2: Chat Home

## 1 Chat Home Screen

### 1.1 Add Logout Avatar

Instead of using a logout, we use an avatar icon to let a user logout. The changed `screens/HomeScreen.js` is as the following:

```js
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
```

### 1.2 Add Header Icons

We add a camera icon and a pencil icon on the right of the header. The camera is for demo purpose only. The pencil icon, if pressed, navigates to an "AddChat" screen. We need to import the icons from different Expo icons library. Use [vector icons doc](https://icons.expo.fyi/) to find the icons. Here we use `import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';`, then add `headerRight` to the `useLayoutEffect` as the following:

```js
headerRight: () => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 80,
      marginRight: 20,
    }}
  >
    <TouchableOpacity activeOpacity={0.5}>
      <AntDesign name="camerao" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.5}>
      <SimpleLineIcons
        onPress={() => navigation.navigate('AddChat')}
        name="pencil"
        size={24}
        color="black"
      />
    </TouchableOpacity>
  </View>
),
```

## 2 Add Chat Screen

This screen lets a user to add a new chat room/channel. The `createChat` function uses Firebase `db` object to create a new collection that is used to store chat messages. We first need to create a firestore database for the project in Firebase console, choose `Firestore Database` to create a new data store. To make it simple, use the development option (**Test Mode**) to simplify the security setup.

The unit of storage in Firebase is the **document**. A document is a record that contains **fields** and **values**. Each document is identified by a name. Documents are stored in **collections**. A collection has a set of documents. In our case, each chat room is a doc that residents in the `chats` collection. A field of doc can be a **subcollection** to store a set of docs. For example, each chat room has a `messages` subcollection that stores messages of that room. Please check [Firestore GetStarted](https://firebase.google.com/docs/firestore/quickstart) and [Data Model](https://firebase.google.com/docs/firestore/data-model) for details.

Then create a `screens/AddChatScreen.js` as the following and add the screen to `App.js` navigation stack.

```js
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from '@rneui/base';
import { AntDesign } from '@expo/vector-icons';

import { addDoc, collection, getFirestore } from 'firebase/firestore';
import firebaseApp from '../firebase/firebase';
const db = getFirestore(firebaseApp);

const AddChatScreen = ({ navigation }) => {
  const [chatName, setChatName] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a New Chat',
      headerBackTitle: 'Chats',
    });
  }, [navigation]);

  async function createChat() {
    try {
      await addDoc(collection(db, 'chats'), { chatName });
      navigation.goBack();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        leftIcon={<AntDesign name="wechat" size={24} color="black" />}
        onChangeText={setChatName}
        onSubmitEditing={createChat}
      />
      <Button
        disabled={!chatName}
        onPress={createChat}
        title="Create a New Chat"
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 30,
    height: '100%',
  },
});
```

## 3 ChatListItem Component

We create a reusable customized list item of chat as the following:

```js
// components/ChatListItem.js
import React from 'react';
import { StyleSheet } from 'react-native';

import { ListItem, Avatar } from '@rneui/base';

const ChatListItem = ({ id, chatName }) => {
  return (
    <ListItem key={id}>
      <Avatar
        source={{
          uri: 'https://www.gstatic.com/mobilesdk/180227_mobilesdk/database_rules_zerostate.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.title}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          The last message of the chat, to show the ellipsize tail we make this
          long. The last message of the chat. The last message of the chat.
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
  },
});
```

## 4 Display Chats

We use `onSnapshot` Firebase function to sync the `chats` collection in `HomeScreen`.

```js
const [chats, setChats] = useState([]);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
    setChats(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
  });
  return unsubscribe;
}, []);
```

We use `SafeAreView` and `ScrollView` to wrap the list of chats.

```js
function createItem(chat) {
  const {
    id,
    data: { chatName },
  } = chat;
  return <ChatListItem id={id} chatName={chatName} />;
}

return (
  <SafeAreaView>
    <ScrollView>{chats.map(createItem)}</ScrollView>
  </SafeAreaView>
);
```
