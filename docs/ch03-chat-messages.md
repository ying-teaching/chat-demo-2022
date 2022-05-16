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
  return <ChatListItem id={id} chatName={chatName} enterChat={enterChat} />;
}
```
