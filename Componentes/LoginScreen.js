import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/conexion/firebaseConfig";

const LoginScreen = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("empleado"); // Valor por defecto

  const registrarUsuario = async () => {
    if (!nombre || !correo || !contraseña) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      // Subir a Firestore
      await addDoc(collection(db, "usuarios"), {
        nombre,
        correo,
        contraseña,
        rol,
        uid: "",
      });
      Alert.alert("Éxito", "Usuario registrado correctamente.");
      setNombre("");
      setCorreo("");
      setContraseña("");
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el usuario: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de Acceso</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#fff"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#fff"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#fff"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
      />
      
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            rol === "empleado" && styles.selectedRole,
          ]}
          onPress={() => setRol("empleado")}
        >
          <Text style={styles.roleText}>Empleado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            rol === "administrador" && styles.selectedRole,
          ]}
          onPress={() => setRol("administrador")}
        >
          <Text style={styles.roleText}>Administrador</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
        <Text style={styles.buttonText}>Registrar Usuario</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4E1",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D81B60",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#D81B60",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFC1E3",
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#D81B60",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFC1E3",
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: "#D81B60",
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
