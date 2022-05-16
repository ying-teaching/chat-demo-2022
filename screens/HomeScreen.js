import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar } from '@rneui/base';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';

import { getAuth, signOut } from 'firebase/auth';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

import firebaseApp from '../firebase/firebase';

import ChatListItem from '../components/ChatListItem';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const HomeScreen = ({ navigation }) => {
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
    });
  }, [navigation]);

  function logout() {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  }

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

  return (
    <SafeAreaView>
      <ScrollView>{chats.map(createItem)}</ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
