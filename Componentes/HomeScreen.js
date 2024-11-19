import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Pastelería</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Autenticación</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Inventario")}
      >
        <Text style={styles.buttonText}>Inventario de Ingredientes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Pedidos")}
      >
        <Text style={styles.buttonText}>Gestión de Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Ventas")}
      >
        <Text style={styles.buttonText}>Área de Ventas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Reportes")}
      >
        <Text style={styles.buttonText}>Reportes y Análisis</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe4e1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#d2691e",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#ff7f50",
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
