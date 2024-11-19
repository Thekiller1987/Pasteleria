import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importar las vistas correctamente
import HomeScreen from "./Componentes/HomeScreen";
import IniciarSesionScreen from "./Componentes/IniciarSesionScreen";
import LoginScreen from "./Componentes/LoginScreen";
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
      <Stack.Navigator
        initialRouteName="IniciarSesion"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FF69B4",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="IniciarSesion"
          component={IniciarSesionScreen}
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inicio" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Control de Acceso" }}
        />
        <Stack.Screen
          name="Inventario"
          component={InventarioScreen}
          options={{ title: "Inventario de Ingredientes" }}
        />
        <Stack.Screen
          name="Pedidos"
          component={PedidosScreen}
          options={{ title: "Gestión de Pedidos" }}
        />
        <Stack.Screen
          name="Ventas"
          component={VentasScreen}
          options={{ title: "Área de Ventas" }}
        />
        <Stack.Screen
          name="Reportes"
          component={ReportesScreen}
          options={{ title: "Reportes y Análisis" }}
        />
        <Stack.Screen
          name="AgregarIngredienteScreen"
          component={AgregarIngredienteScreen}
          options={{ title: "Agregar Ingrediente" }}
        />
        <Stack.Screen
          name="EditarIngredienteScreen"
          component={EditarIngredienteScreen}
          options={{ title: "Editar Ingrediente" }}
        />
        <Stack.Screen
          name="AgregarPedido"
          component={AgregarPedidoScreen}
          options={{ title: "Agregar Pedido" }}
        />
        <Stack.Screen
          name="EditarPedido"
          component={EditarPedidoScreen}
          options={{ title: "Editar Pedido" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
