import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../conexion/firebaseConfig"; // Ajusta la ruta según corresponda

const InventarioScreen = ({ navigation }) => {
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventario"), (snapshot) => {
      const ingredientesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIngredientes(ingredientesList);
    });

    return unsubscribe;
  }, []);

  const eliminarIngrediente = (id) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este ingrediente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "inventario", id));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.imagenBase64
            ? { uri: `data:image/png;base64,${item.imagenBase64}` }
            : require("../assets/default-image.png") // Imagen por defecto
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombreIngrediente}</Text>
        <Text>Cantidad: {item.cantidadDisponible}</Text>
        <Text>Costo Unidad: C$ {item.costoUnidad.toFixed(2)}</Text>
        <Text>Actualizado: {new Date(item.fechaActualizacion.seconds * 1000).toLocaleDateString()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditarIngredienteScreen", { id: item.id })}
        >
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarIngrediente(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay ingredientes registrados</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AgregarIngredienteScreen")}
      >
        <Ionicons name="add-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default InventarioScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  card: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "bold" },
  actions: { justifyContent: "space-between", alignItems: "center" },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4caf50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});
