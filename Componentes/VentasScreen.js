import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../conexion/firebaseConfig";

const VentasScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [totalGanancia, setTotalGanancia] = useState(0);
  const [fechaFiltro, setFechaFiltro] = useState(new Date());
  const [isCobrando, setIsCobrando] = useState(false);

  // Cargar pedidos en estado "Finalizado"
  useEffect(() => {
    const unsubscribePedidos = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const pedidosFinalizados = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((pedido) => pedido.estado === "Finalizado");
      setPedidos(pedidosFinalizados);
    });

    // Cargar historial de ventas
    const unsubscribeVentas = onSnapshot(collection(db, "ventas"), (snapshot) => {
      const ventasList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVentas(ventasList);
    });

    return () => {
      unsubscribePedidos();
      unsubscribeVentas();
    };
  }, []);

  // Calcular total de ganancias basado en el filtro de fecha
  useEffect(() => {
    const ventasFiltradas = ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fechaVenta.seconds * 1000);
      return (
        fechaVenta.toDateString() === fechaFiltro.toDateString() // Compara solo la fecha
      );
    });
    const total = ventasFiltradas.reduce((acc, venta) => acc + venta.precioVenta, 0);
    setTotalGanancia(total);
  }, [ventas, fechaFiltro]);

  // Función para cobrar un pedido con animación
  const cobrarPedido = async (pedido) => {
    Alert.alert(
      "Confirmar Cobro",
      `¿Está seguro de cobrar este pedido por C$ ${pedido.precioTotal.toFixed(2)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cobrar",
          onPress: async () => {
            setIsCobrando(true); // Mostrar animación

            setTimeout(async () => {
              try {
                // Actualizar el estado del pedido a "Entregado"
                await updateDoc(doc(db, "pedidos", pedido.id), { estado: "Entregado" });

                // Guardar el pedido en la colección "ventas"
                await addDoc(collection(db, "ventas"), {
                  producto: `Pedido de ${pedido.cliente}`,
                  cantidad: 1,
                  precioVenta: pedido.precioTotal,
                  fechaVenta: new Date(),
                  detalle: pedido.detalles,
                });

                setIsCobrando(false); // Ocultar animación
                Alert.alert("Éxito", "Pedido cobrado exitosamente.");
              } catch (error) {
                setIsCobrando(false); // Ocultar animación
                console.error("Error al cobrar el pedido:", error);
                Alert.alert("Error", "No se pudo cobrar el pedido.");
              }
            }, 2000); // 2 segundos de delay
          },
        },
      ]
    );
  };

  // Renderizar un pedido finalizado
  const renderPedido = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>Cliente: {item.cliente}</Text>
        <Text>Precio Total: C$ {item.precioTotal.toFixed(2)}</Text>
        <Text>Detalles: {item.detalles}</Text>
      </View>
      <TouchableOpacity
        style={styles.cobrarButton}
        onPress={() => cobrarPedido(item)}
      >
        <Text style={styles.cobrarText}>Cobrar</Text>
        <Ionicons name="cash-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Renderizar una venta del historial
  const renderVenta = ({ item }) => (
    <View style={styles.historialCard}>
      <Text style={styles.historialText}>Producto: {item.producto}</Text>
      <Text style={styles.historialText}>
        Fecha: {new Date(item.fechaVenta.seconds * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.historialText}>Precio: C$ {item.precioVenta.toFixed(2)}</Text>
      <Text style={styles.historialText}>Detalle: {item.detalle}</Text>
    </View>
  );

  // Mostrar animación de pago
  if (isCobrando) {
    return (
      <View style={styles.cobroContainer}>
        <LottieView
          source={require("C:/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/animaciones/pago.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.totalGanancia}>
        Total de Ganancia: C$ {totalGanancia.toFixed(2)}
      </Text>
      <View style={styles.inputContainer}>
        <Text>Fecha seleccionada: {fechaFiltro.toLocaleDateString()}</Text>
        <TouchableOpacity
          style={styles.changeDateButton}
          onPress={() => setMostrarPicker(true)}
        >
          <Text style={styles.changeDateText}>Cambiar Fecha</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={renderPedido}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos para cobrar</Text>}
      />
      <Text style={styles.historialTitle}>Historial de Ventas</Text>
      <FlatList
        data={ventas.filter((venta) => {
          const fechaVenta = new Date(venta.fechaVenta.seconds * 1000);
          return fechaVenta.toDateString() === fechaFiltro.toDateString();
        })}
        keyExtractor={(item) => item.id}
        renderItem={renderVenta}
        ListEmptyComponent={<Text style={styles.empty}>No hay ventas registradas</Text>}
      />
    </View>
  );
};

export default VentasScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe4e1", padding: 10 },
  totalGanancia: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  changeDateButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
  },
  changeDateText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  cobrarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
  },
  cobrarText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginVertical: 10,
    textAlign: "center",
  },
  historialCard: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    elevation: 1,
  },
  historialText: {
    fontSize: 14,
    color: "#4a4a4a",
  },
  cobroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe4e1",
  },
  animation: {
    width: 300, // Tamaño grande
    height: 300,
  },
});
