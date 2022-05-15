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
