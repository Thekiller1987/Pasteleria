import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';
import LottieView from 'lottie-react-native';

const PedidosScreen = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pedidos'), (snapshot) => {
      const pedidosList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(pedidosList);
    });

    return unsubscribe;
  }, []);

  const eliminarPedido = (id) => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          await deleteDoc(doc(db, 'pedidos', id));
          setIsLoading(false);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>Cliente: {item.cliente}</Text>
        <Text>Fecha: {new Date(item.fechaPedido.seconds * 1000).toLocaleDateString()}</Text>
        <Text>Precio Total: C$ {item.precioTotal.toFixed(2)}</Text>
        <Text>Detalles: {item.detalles}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarPedidoScreen', { id: item.id })}
        >
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarPedido(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../animaciones/basura.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pedidos En Proceso</Text>
      <FlatList
        data={pedidos.filter((pedido) => pedido.estado === 'En proceso')}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos en proceso</Text>}
      />

      <Text style={styles.sectionTitle}>Pedidos Finalizados</Text>
      <FlatList
        data={pedidos.filter((pedido) => pedido.estado === 'Finalizado')}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos finalizados</Text>}
      />

      <Text style={styles.sectionTitle}>Pedidos Entregados</Text>
      <FlatList
        data={pedidos.filter((pedido) => pedido.estado === 'Entregado')}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay pedidos entregados</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AgregarPedidoScreen')}
      >
        <Ionicons name="add-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default PedidosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffe4e1', paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  actions: { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff7f50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  empty: { textAlign: 'center', marginTop: 10, fontSize: 14, color: 'gray' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
