// Importar las funciones necesarias desde Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto Firebase (ya tienes estos datos)
const firebaseConfig = {
  apiKey: "AIzaSyBmE7cKWQk7TuKL41YpEb0wdDmUMIby4Go",
  authDomain: "pasteleria-72c36.firebaseapp.com",
  projectId: "pasteleria-72c36",
  storageBucket: "pasteleria-72c36.appspot.com",
  messagingSenderId: "937233099271",
  appId: "1:937233099271:web:db1b38c1eba229fb9c58a2",
  measurementId: "G-9PQ6XQQGMB",
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar las configuraciones para usarlas en otros archivos
export { app, db };
