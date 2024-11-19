import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";

const HomeScreen = ({ navigation, route }) => {
  const { rol, nombre } = route.params || {}; // Recibe el rol y el nombre del usuario
  const [accesoDenegado, setAccesoDenegado] = useState(false);

  const manejarNavegacion = (pantalla) => {
    if (rol === "empleado" && pantalla !== "Ventas") {
      setAccesoDenegado(true); // Mostrar animación de acceso denegado
      setTimeout(() => setAccesoDenegado(false), 3000); // Ocultar animación después de 3 segundos
    } else {
      navigation.navigate(pantalla); // Navegar si tiene acceso
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con el bienvenido y el nombre del usuario */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Bienvenido, <Text style={styles.userName}>{nombre || "Usuario"}</Text>
        </Text>
        <Text style={styles.userRole}>{`Rol: ${rol || "Desconocido"}`}</Text>
      </View>

      <Image
        source={require("../assets/pasteleria_logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Gestión de Pastelería</Text>

      {accesoDenegado ? (
        <View style={styles.accessDeniedContainer}>
          <LottieView
            source={require("C:/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/animaciones/denegado.json")}
            autoPlay
            loop={false}
            style={styles.animacion}
          />
          <Text style={styles.accessDeniedText}>Acceso Denegado</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => manejarNavegacion("Login")}
          >
            <Text style={styles.buttonText}>Autenticación</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => manejarNavegacion("Inventario")}
          >
            <Text style={styles.buttonText}>Inventario de Ingredientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => manejarNavegacion("Pedidos")}
          >
            <Text style={styles.buttonText}>Gestión de Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => manejarNavegacion("Ventas")}
          >
            <Text style={styles.buttonText}>Área de Ventas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => manejarNavegacion("Reportes")}
          >
            <Text style={styles.buttonText}>Reportes y Análisis</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FF69B4",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFE4E1",
  },
  userRole: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D2691E",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FF69B4",
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  accessDeniedContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  animacion: {
    width: 200,
    height: 200,
  },
  accessDeniedText: {
    marginTop: 10,
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});
