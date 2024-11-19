import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Componentes/HomeScreen";
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
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Inventario" component={InventarioScreen} />
        <Stack.Screen name="Pedidos" component={PedidosScreen} />
        <Stack.Screen name="Ventas" component={VentasScreen} />
        <Stack.Screen name="Reportes" component={ReportesScreen} />
        <Stack.Screen name="AgregarPedidoScreen" component={AgregarPedidoScreen} />
        <Stack.Screen name="EditarPedidoScreen" component={EditarPedidoScreen} />
        <Stack.Screen name="AgregarIngredienteScreen" component={AgregarIngredienteScreen} />
        <Stack.Screen name="EditarIngredienteScreen" component={EditarIngredienteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
