import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PedidosScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla de Pedidos (Por implementar)</Text>
  </View>
);

export default PedidosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});
