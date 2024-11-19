import React from "react";
import { View, Text, StyleSheet } from "react-native";

const VentasScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla de Ventas (Por implementar)</Text>
  </View>
);

export default VentasScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});
