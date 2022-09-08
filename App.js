/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  TextInput 
} from 'react-native';



const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // const listMessage = ["123", "4356"]
  const [listMessage, setListMessage] = useState(["123", "43567"])
  const [text, onChangeText] = useState("Useless Text");

  const onAddingMessage = () => {
    setListMessage([
      ...listMessage,
      text
    ])
  }

  return (
    <>
      {  
        listMessage.map((l, index) => {
          return (
            <Text key={index}>{l}</Text>
          )
        })
      }
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        onBlur={onAddingMessage}
        value={text}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
