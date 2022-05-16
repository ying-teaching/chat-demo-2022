import React from 'react';
import { StyleSheet } from 'react-native';

import { ListItem, Avatar } from '@rneui/base';

const ChatListItem = ({ id, chatName, enterChat }) => {
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)}>
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
