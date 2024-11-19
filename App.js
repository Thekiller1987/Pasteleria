import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Componentes/HomeScreen";
import LoginScreen from "./Componentes/LoginScreen"; // Mantiene el LoginScreen existente
import IniciarSesionScreen from "./Componentes/IniciarSesionScreen"; // Nuevo componente para el inicio de sesión con roles
import InventarioScreen from "./Componentes/InventarioScreen";
import PedidosScreen from "./Componentes/PedidosScreen";
import VentasScreen from "./Componentes/VentasScreen";
import ReportesScreen from "./Componentes/ReportesScreen";
import AgregarIngredienteScreen from "./Componentes/AgregarIngredienteScreen";
import EditarIngredienteScreen from "./Componentes/EditarIngredienteScreen";
import AgregarPedidoScreen from "./Componentes/AgregarPedidoScreen";
import EditarPedidoScreen from "./Componentes/EditarPedidoScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IniciarSesion">
        {/* Nueva pantalla para el inicio de sesión con roles */}
        <Stack.Screen
          name="IniciarSesion"
          component={IniciarSesionScreen}
          options={{ title: "Iniciar Sesión" }}
        />
        {/* Pantalla principal */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* LoginScreen existente (si aún necesitas esta pantalla) */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Inventario */}
        <Stack.Screen name="Inventario" component={InventarioScreen} />
        {/* Pedidos */}
        <Stack.Screen name="Pedidos" component={PedidosScreen} />
        {/* Ventas */}
        <Stack.Screen name="Ventas" component={VentasScreen} />
        {/* Reportes */}
        <Stack.Screen name="Reportes" component={ReportesScreen} />
        {/* Gestión de Ingredientes */}
        <Stack.Screen
          name="AgregarIngredienteScreen"
          component={AgregarIngredienteScreen}
        />
        <Stack.Screen
          name="EditarIngredienteScreen"
          component={EditarIngredienteScreen}
        />
        {/* Gestión de Pedidos */}
        <Stack.Screen
          name="AgregarPedidoScreen"
          component={AgregarPedidoScreen}
        />
        <Stack.Screen name="EditarPedidoScreen" component={EditarPedidoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
