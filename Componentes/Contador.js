import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Contador({ contador }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Clics: {contador}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  texto: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
