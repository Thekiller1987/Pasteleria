import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const AgregarIngredienteScreen = ({ navigation }) => {
  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    solicitarPermisos();
  }, []);

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Se requiere acceso a la galería para seleccionar imágenes.'
      );
    }
  };

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        setImagenBase64(result.assets[0].base64);
      } else {
        Alert.alert(
          'Imagen no seleccionada',
          'Por favor, selecciona una imagen válida.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al seleccionar la imagen.');
      console.error('Error seleccionando imagen:', error);
    }
  };

  const agregarIngrediente = async () => {
    if (!nombreIngrediente || !cantidadDisponible || !costoUnidad) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'inventario'), {
        nombreIngrediente,
        cantidadDisponible: parseInt(cantidadDisponible),
        costoUnidad: parseFloat(costoUnidad),
        imagenBase64: imagenBase64 || '',
        fechaActualizacion: new Date(),
      });
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Éxito', 'Ingrediente agregado correctamente');
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'No se pudo agregar el ingrediente');
      console.error('Error al agregar ingrediente:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../animaciones/pastelcargando.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Ingrediente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Ingrediente"
        value={nombreIngrediente}
        onChangeText={setNombreIngrediente}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad Disponible"
        value={cantidadDisponible}
        onChangeText={setCantidadDisponible}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Costo por Unidad"
        value={costoUnidad}
        onChangeText={setCostoUnidad}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imagenBase64 ? (
        <Image
          source={{ uri: `data:image/png;base64,${imagenBase64}` }}
          style={styles.imagePreview}
        />
      ) : null}
      <TouchableOpacity style={styles.addButton} onPress={agregarIngrediente}>
        <Text style={styles.addButtonText}>Agregar Ingrediente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D81B60',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  imageButton: {
    backgroundColor: '#D81B60',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#D81B60',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AgregarIngredienteScreen;
