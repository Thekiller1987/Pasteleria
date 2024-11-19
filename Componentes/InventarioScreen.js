import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../conexion/firebaseConfig";
import LottieView from "lottie-react-native";

const InventarioScreen = ({ navigation }) => {
  const [ingredientes, setIngredientes] = useState([]);
  const [animando, setAnimando] = useState(false);
  const animacionRef = useRef(null);

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
          setAnimando(true);
          animacionRef.current.play();
          setTimeout(async () => {
            await deleteDoc(doc(db, "inventario", id));
            setAnimando(false);
          }, 1500); // Duración de la animación
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
            : require("../assets/default-image.png")
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombreIngrediente}</Text>
        <Text>Cantidad: {item.cantidadDisponible}</Text>
        <Text>Costo Unidad: C$ {item.costoUnidad.toFixed(2)}</Text>
        <Text>
          Actualizado:{" "}
          {new Date(item.fechaActualizacion.seconds * 1000).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditarIngredienteScreen", { id: item.id })
          }
        >
          <Ionicons name="create-outline" size={24} color="#d81b60" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarIngrediente(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#d81b60" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {animando && (
        <View style={styles.animationContainer}>
          <LottieView
            ref={animacionRef}
            source={require("../animaciones/basura.json")}
            loop={false}
            onAnimationFinish={() => setAnimando(false)}
            style={styles.animation}
          />
        </View>
      )}
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay ingredientes registrados</Text>
        }
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
  container: { flex: 1, backgroundColor: "#fce4ec" },
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
  name: { fontSize: 16, fontWeight: "bold", color: "#880e4f" },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#d81b60",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  animation: {
    width: 200,
    height: 200,
  },
});
 