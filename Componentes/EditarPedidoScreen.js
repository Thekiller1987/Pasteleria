import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';

const EditarPedidoScreen = ({ route, navigation }) => {
  const { id } = route.params; // ID del pedido a editar
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [detalles, setDetalles] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('');
  const [precioTotal, setPrecioTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cargarPedido = async () => {
      setIsLoading(true);
      try {
        const pedidoDoc = await getDoc(doc(db, 'pedidos', id));
        if (pedidoDoc.exists()) {
          const data = pedidoDoc.data();
          setPedido(data);
          setCliente(data.cliente);
          setIngredientes(data.ingredientes || []);
          setDetalles(data.detalles);
          setEstadoPedido(data.estado);
          setPrecioTotal(data.precioTotal);
        } else {
          Alert.alert('Error', 'El pedido no existe');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
        Alert.alert('Error', 'No se pudo cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    cargarPedido();
  }, [id]);

  const guardarCambios = async () => {
    if (!cliente || ingredientes.length === 0) {
      Alert.alert('Error', 'El cliente y al menos un ingrediente son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'pedidos', id), {
        cliente,
        ingredientes,
        detalles,
        estado: estadoPedido,
        precioTotal,
      });

      Alert.alert('Éxito', 'Pedido actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      Alert.alert('Error', 'No se pudo actualizar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const modificarCantidadIngrediente = (idIngrediente, nuevaCantidad) => {
    setIngredientes((prevIngredientes) =>
      prevIngredientes.map((ing) =>
        ing.id === idIngrediente ? { ...ing, cantidad: nuevaCantidad } : ing
      )
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('C:/Users/waska/OneDrive/Escritorio/claseProfeYesenia/individual/Pasteleria/animaciones/preparando.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Image
              source={{ uri: `data:image/png;base64,${item.imagenBase64}` }}
              style={styles.ingredientImage}
            />
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{item.nombreIngrediente}</Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={item.cantidad.toString()}
                onChangeText={(cantidad) =>
                  modificarCantidadIngrediente(item.id, parseInt(cantidad) || 1)
                }
              />
            </View>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Detalles del Pedido"
        value={detalles}
        onChangeText={setDetalles}
        multiline
      />

      <Text style={styles.sectionTitle}>Estado del Pedido</Text>
      <Picker
        selectedValue={estadoPedido}
        style={styles.picker}
        onValueChange={(itemValue) => setEstadoPedido(itemValue)}
      >
        <Picker.Item label="En proceso" value="En proceso" />
        <Picker.Item label="Finalizado" value="Finalizado" />
      </Picker>

      <Text style={styles.totalText}>Total: C$ {precioTotal.toFixed(2)}</Text>

      <Button title="Guardar Cambios" onPress={guardarCambios} color="#ff7f50" />
    </ScrollView>
  );
};

export default EditarPedidoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffe4e1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffc0cb',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ffc0cb',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d21c57',
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8c1d9',
    borderRadius: 5,
  },
  ingredientImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 60,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#d21c57',
  },
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
