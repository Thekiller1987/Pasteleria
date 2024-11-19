import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native'; // Importar Lottie para la animación
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';

const AgregarPedidoScreen = ({ navigation }) => {
  const [cliente, setCliente] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);
  const [detalles, setDetalles] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('En proceso');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar ingredientes desde Firebase
  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const inventarioSnapshot = await getDocs(collection(db, 'inventario'));
        const ingredientesCargados = inventarioSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIngredientes(ingredientesCargados);
      } catch (error) {
        console.error('Error al cargar ingredientes:', error);
        Alert.alert('Error', 'No se pudieron cargar los ingredientes');
      }
    };

    cargarIngredientes();
  }, []);

  const mostrarAnimacion = async (accion) => {
    setIsLoading(true);

    const startTime = Date.now();
    await accion();
    const elapsedTime = Date.now() - startTime;

    const tiempoMinimo = 4000; // 4 segundos
    if (elapsedTime < tiempoMinimo) {
      await new Promise((resolve) => setTimeout(resolve, tiempoMinimo - elapsedTime));
    }

    setIsLoading(false);
  };

  // Agregar ingrediente a la lista seleccionada
  const agregarIngrediente = (ingrediente) => {
    const yaSeleccionado = ingredientesSeleccionados.find((ing) => ing.id === ingrediente.id);

    if (yaSeleccionado) {
      Alert.alert('Atención', 'Este ingrediente ya está en la lista.');
    } else {
      setIngredientesSeleccionados((prevSeleccionados) => [
        ...prevSeleccionados,
        { ...ingrediente, cantidad: 1 },
      ]);
    }
  };

  // Quitar ingrediente de la lista seleccionada
  const quitarIngrediente = (idIngrediente) => {
    setIngredientesSeleccionados((prevSeleccionados) =>
      prevSeleccionados.filter((ing) => ing.id !== idIngrediente)
    );
  };

  // Modificar cantidad del ingrediente seleccionado
  const modificarCantidad = (idIngrediente, nuevaCantidad) => {
    setIngredientesSeleccionados((prevSeleccionados) =>
      prevSeleccionados.map((ing) =>
        ing.id === idIngrediente ? { ...ing, cantidad: nuevaCantidad } : ing
      )
    );
  };

  // Finalizar pedido
  const finalizarPedido = async () => {
    if (!cliente || ingredientesSeleccionados.length === 0) {
      Alert.alert('Error', 'El cliente y al menos un ingrediente son obligatorios');
      return;
    }

    await mostrarAnimacion(async () => {
      try {
        let precioTotal = 0;

        for (const ingrediente of ingredientesSeleccionados) {
          precioTotal += ingrediente.cantidad * ingrediente.costoUnidad;

          const nuevaCantidad = ingrediente.cantidadDisponible - ingrediente.cantidad;
          if (nuevaCantidad < 0) {
            throw new Error(`Cantidad insuficiente de ${ingrediente.nombreIngrediente} en el inventario.`);
          }

          // Actualizar la cantidad en el inventario
          await updateDoc(doc(db, 'inventario', ingrediente.id), {
            cantidadDisponible: nuevaCantidad,
          });
        }

        // Añadir el 30% de margen de ganancia
        const precioConMargen = precioTotal + precioTotal * 0.3;

        // Crear el pedido
        await addDoc(collection(db, 'pedidos'), {
          cliente,
          ingredientes: ingredientesSeleccionados,
          precioTotal: precioConMargen,
          detalles,
          estado: estadoPedido,
          fechaPedido: new Date(),
        });

        Alert.alert('Éxito', 'Pedido agregado correctamente');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message || 'No se pudo finalizar el pedido');
        console.error('Error al finalizar pedido:', error);
      }
    });
  };

  // Filtrar ingredientes por nombre
  const ingredientesFiltrados = ingredientes.filter((ing) =>
    ing.nombreIngrediente.toLowerCase().includes(filtroNombre.toLowerCase())
  );

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

      <TextInput
        style={styles.input}
        placeholder="Buscar Ingrediente"
        value={filtroNombre}
        onChangeText={setFiltroNombre}
      />

      <FlatList
        data={ingredientesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.ingredientItem}
            onPress={() => agregarIngrediente(item)}
          >
            <Image
              source={{ uri: `data:image/png;base64,${item.imagenBase64}` }}
              style={styles.ingredientImage}
            />
            <View>
              <Text style={styles.ingredientText}>{item.nombreIngrediente}</Text>
              <Text style={styles.ingredientText}>
                Disponibles: {item.cantidadDisponible}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Seleccionar Ingredientes</Text>
        )}
      />

      <FlatList
        data={ingredientesSeleccionados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.selectedIngredient}>
            <Image
              source={{ uri: `data:image/png;base64,${item.imagenBase64}` }}
              style={styles.selectedImage}
            />
            <View>
              <Text style={styles.ingredientText}>{item.nombreIngrediente}</Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={item.cantidad.toString()}
                onChangeText={(cantidad) =>
                  modificarCantidad(item.id, parseInt(cantidad) || 1)
                }
              />
            </View>
            <Button title="Quitar" color="#ff3b3b" onPress={() => quitarIngrediente(item.id)} />
          </View>
        )}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Ingredientes Seleccionados</Text>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Detalles Adicionales"
        value={detalles}
        onChangeText={setDetalles}
        multiline
      />

      <Text style={styles.sectionTitle}>Estado del Pedido</Text>

      <Button title="Finalizar Pedido" onPress={finalizarPedido} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffe4e1', // Rosa claro de fondo
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffc0cb',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
  ingredientText: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  selectedIngredient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f4a4b3',
    borderRadius: 5,
  },
  selectedImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  quantityInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d21c57',
    marginVertical: 10,
  },
});

export default AgregarPedidoScreen;
