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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../conexion/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const EditarIngredienteScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso a la galería para seleccionar imágenes.'
        );
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

    setIsLoading(true);

    try {
      const docRef = doc(db, 'inventario', id);
      await updateDoc(docRef, {
        nombreIngrediente,
        cantidadDisponible: parseInt(cantidadDisponible),
        costoUnidad: parseFloat(costoUnidad),
        imagenBase64: imagenBase64 || '',
        fechaActualizacion: new Date(),
      });
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Éxito', 'Ingrediente actualizado correctamente');
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'No se pudo actualizar el ingrediente');
      console.error('Error al actualizar ingrediente:', error);
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
      <Text style={styles.title}>Editar Ingrediente</Text>
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
      <TouchableOpacity style={styles.updateButton} onPress={actualizarIngrediente}>
        <Text style={styles.updateButtonText}>Actualizar Ingrediente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
  },
  animation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C71585',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#C71585',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  imageButton: {
    backgroundColor: '#FF69B4',
    padding: 12,
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
    borderColor: '#C71585',
  },
  updateButton: {
    backgroundColor: '#C71585',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditarIngredienteScreen;
