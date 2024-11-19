import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const AgregarIngredienteScreen = ({ navigation }) => {
  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');

  useEffect(() => {
    solicitarPermisos();
  }, []);

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar imágenes.');
    }
  };

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images', // Especifica directamente el tipo de medios
        base64: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        const imagenBase64 = result.assets[0].base64;
        setImagenBase64(imagenBase64);
      } else {
        Alert.alert('Imagen no seleccionada', 'Por favor, selecciona una imagen válida.');
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

    try {
      await addDoc(collection(db, 'inventario'), {
        nombreIngrediente,
        cantidadDisponible: parseInt(cantidadDisponible),
        costoUnidad: parseFloat(costoUnidad),
        imagenBase64: imagenBase64 || '',
        fechaActualizacion: new Date(),
      });
      Alert.alert('Éxito', 'Ingrediente agregado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el ingrediente');
      console.error('Error al agregar ingrediente:', error);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Agregar Ingrediente" onPress={agregarIngrediente} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default AgregarIngredienteScreen;
