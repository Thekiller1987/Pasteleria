import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text, Image } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const EditarIngredienteScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');

  useEffect(() => {
    const fetchIngrediente = async () => {
      const docRef = doc(db, 'inventario', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombreIngrediente(data.nombreIngrediente);
        setCantidadDisponible(data.cantidadDisponible.toString());
        setCostoUnidad(data.costoUnidad.toString());
        setImagenBase64(data.imagenBase64 || '');
      }
    };

    const solicitarPermisos = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar imágenes.');
      }
    };

    fetchIngrediente();
    solicitarPermisos();
  }, [id]);

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
        Alert.alert('Selección cancelada', 'No se seleccionó ninguna imagen.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al seleccionar la imagen.');
      console.error('Error seleccionando imagen:', error);
    }
  };

  const actualizarIngrediente = async () => {
    if (!nombreIngrediente || !cantidadDisponible || !costoUnidad) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const docRef = doc(db, 'inventario', id);
      await updateDoc(docRef, {
        nombreIngrediente,
        cantidadDisponible: parseInt(cantidadDisponible),
        costoUnidad: parseFloat(costoUnidad),
        imagenBase64: imagenBase64 || '',
        fechaActualizacion: new Date(),
      });
      Alert.alert('Éxito', 'Ingrediente actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el ingrediente');
      console.error('Error al actualizar ingrediente:', error);
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
      <Button title="Actualizar Ingrediente" onPress={actualizarIngrediente} />
    </View>
  );
};

export default EditarIngredienteScreen;

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
