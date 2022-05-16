# Chat App Demo

This is chat app demo based on the Youtube video [Let's build SIGNAL with REACT NATIVE](https://youtu.be/MJzmZ9qmdaE). Two major changes are 1) bug fixes and 2) May 2022 versions of React Native, Expo tools, RN libraries and Firebase tools. The development has three phases:

- [Login and Register](./docs/ch01-login-register.md)
- [Chat Home](./docs/ch02-chat-home.md)
- [Chat Messages](./docs/ch03-chat-messages.md)

## iOS Build Error

We have to create `metro.config.js` in the project root to fix iOS build error. The file has the following content:

```js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'], // the `cjs` fixes iOS error
  },
};
```

As shown in the comments, the `'cjs'` fixes the iOS build error.
