import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../conexion/firebaseConfig";

export default function IniciarSesionScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setIsAccessDenied(true);
      setTimeout(() => setIsAccessDenied(false), 3000); // Mostrar animación de error
      return;
    }

    try {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("correo", "==", email), where("contraseña", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data(); // Obtener datos del usuario
        const { nombre, rol } = userData;

        // Mostrar animación de acceso permitido
        setIsAccessGranted(true);
        setTimeout(() => {
          setIsAccessGranted(false); // Resetear estado
          navigation.navigate("Home", { nombre, rol }); // Navegar al Home
        }, 3000);
      } else {
        // Mostrar animación de acceso denegado
        setIsAccessDenied(true);
        setTimeout(() => setIsAccessDenied(false), 3000); // Ocultar después de 3 segundos
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isAccessDenied && (
        <View style={styles.animationContainer}>
          <LottieView
            source={require("C:/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/animaciones/denegado.json")}
            autoPlay
            loop={false}
            style={styles.largeAnimation}
          />
          <Text style={styles.largeAccessDeniedText}>Acceso Denegado</Text>
        </View>
      )}
      {isAccessGranted && (
        <View style={styles.animationContainer}>
          <LottieView
            source={require("C:/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/animaciones/acceso.json")}
            autoPlay
            loop={false}
            style={styles.largeAnimation}
          />
          <Text style={styles.largeAccessGrantedText}>¡Acceso Permitido!</Text>
        </View>
      )}
      {!isAccessDenied && !isAccessGranted && (
        <View style={styles.formContainer}>
          {/* Logo de la app */}
          <Image
            source={require("../assets/pasteleria_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    padding: 20,
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20, // Espacio debajo del logo
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D2691E",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: "#D2691E",
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FF69B4",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  largeAnimation: {
    width: 400,
    height: 400,
  },
  largeAccessDeniedText: {
    marginTop: 15,
    fontSize: 22,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  largeAccessGrantedText: {
    marginTop: 15,
    fontSize: 22,
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
});
