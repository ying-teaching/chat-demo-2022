import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ListItem, Avatar } from '@rneui/base';

import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import firebaseApp from '../firebase/firebase';

const db = getFirestore(firebaseApp);

const ChatListItem = ({ id, chatName, enterChat }) => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const messagesRef = collection(db, 'chats', id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMessage(doc.data());
      });
    });
    return unsubscribe;
  }, []);

  return (
    <ListItem onPress={() => enterChat(id, chatName)}>
      <Avatar
        source={{
          uri: 'https://www.gstatic.com/mobilesdk/180227_mobilesdk/database_rules_zerostate.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.title}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {message
            ? message.displayName + ' : ' + message.message
            : 'No Message'}
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
