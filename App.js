import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Componentes/HomeScreen";
import LoginScreen from "./Componentes/LoginScreen";
import InventarioScreen from "./Componentes/InventarioScreen";
import PedidosScreen from "./Componentes/PedidosScreen";
import VentasScreen from "./Componentes/VentasScreen";
import ReportesScreen from "./Componentes/ReportesScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
