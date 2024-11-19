import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/conexion/firebaseConfig";

const LoginScreen = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("empleado"); // Valor por defecto
  const [usuarios, setUsuarios] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Función para registrar o editar usuario
  const registrarUsuario = async () => {
    if (!nombre || !correo || !contraseña) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      if (isEditing) {
        // Editar usuario existente
        const userRef = doc(db, "usuarios", currentUserId);
        await updateDoc(userRef, {
          nombre,
          correo,
          contraseña,
          rol,
        });
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } else {
        // Registrar nuevo usuario
        await addDoc(collection(db, "usuarios"), {
          nombre,
          correo,
          contraseña,
          rol,
          uid: "",
        });
        Alert.alert("Éxito", "Usuario registrado correctamente.");
      }
      resetForm();
      fetchUsuarios();
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el usuario: " + error.message);
    }
  };

  // Función para obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(usuariosList);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios: " + error.message);
    }
  };

  // Función para eliminar usuario
  const eliminarUsuario = async (id) => {
    try {
      const userRef = doc(db, "usuarios", id);
      await deleteDoc(userRef);
      Alert.alert("Éxito", "Usuario eliminado correctamente.");
      fetchUsuarios();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el usuario: " + error.message);
    }
  };

  // Función para editar usuario
  const editarUsuario = (usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setContraseña(usuario.contraseña);
    setRol(usuario.rol);
    setCurrentUserId(usuario.id);
    setIsEditing(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setNombre("");
    setCorreo("");
    setContraseña("");
    setRol("empleado");
    setIsEditing(false);
    setCurrentUserId(null);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isEditing ? "Editar Usuario" : "Control de Acceso"}</Text>

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
            style={[styles.roleButton, rol === "empleado" && styles.selectedRole]}
            onPress={() => setRol("empleado")}
          >
            <Text style={styles.roleText}>Empleado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, rol === "administrador" && styles.selectedRole]}
            onPress={() => setRol("administrador")}
          >
            <Text style={styles.roleText}>Administrador</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
          <Text style={styles.buttonText}>{isEditing ? "Actualizar Usuario" : "Registrar Usuario"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.nombre}</Text>
            <Text style={styles.userText}>{item.correo}</Text>
            <Text style={styles.userText}>{`Rol: ${item.rol}`}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editarUsuario(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarUsuario(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D81B60",
    marginBottom: 20,
    textAlign: "center",
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
  userItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#FFB347",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
});
