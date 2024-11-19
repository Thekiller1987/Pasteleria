import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function Botones({ incrementar, disminuir, reiniciar }) {
  return (
    <View style={styles.container}>
      <Button title="Incrementar" onPress={incrementar} />
      <Button title="Disminuir" onPress={disminuir} />
      <Button title="Reiniciar" onPress={reiniciar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});
