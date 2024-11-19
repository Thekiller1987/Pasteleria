import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../conexion/firebaseConfig";
import { captureRef } from "react-native-view-shot";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const screenWidth = Dimensions.get("window").width;

const ReportesScreen = () => {
  const [datosDia, setDatosDia] = useState([]);
  const [datosMes, setDatosMes] = useState([]);
  const [datosAnio, setDatosAnio] = useState([]);
  const [datosPie, setDatosPie] = useState([]);
  const [loading, setLoading] = useState(true);

  const coloresPastel = ["#FF6384", "#FFB6C1", "#FFC0CB", "#FFD1DC", "#FFE4E1"];
  const barChartRefDia = useRef(null);
  const barChartRefMes = useRef(null);
  const barChartRefAnio = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const ventasSnapshot = await getDocs(collection(db, "ventas"));
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));

      const hoy = new Date();
      const datosGananciasDia = ventasSnapshot.docs
        .filter((doc) => {
          const fechaVenta = new Date(doc.data().fechaVenta.seconds * 1000);
          return fechaVenta.toDateString() === hoy.toDateString();
        })
        .map((doc) => ({
          producto: doc.data().producto,
          precioVenta: doc.data().precioVenta * 0.3,
        }));

      const datosGananciasMes = ventasSnapshot.docs
        .filter((doc) => {
          const fechaVenta = new Date(doc.data().fechaVenta.seconds * 1000);
          return (
            fechaVenta.getMonth() === hoy.getMonth() &&
            fechaVenta.getFullYear() === hoy.getFullYear()
          );
        })
        .map((doc) => ({
          producto: doc.data().producto,
          precioVenta: doc.data().precioVenta * 0.3,
        }));

      const datosGananciasAnio = ventasSnapshot.docs
        .filter((doc) => {
          const fechaVenta = new Date(doc.data().fechaVenta.seconds * 1000);
          return fechaVenta.getFullYear() === hoy.getFullYear();
        })
        .map((doc) => ({
          producto: doc.data().producto,
          precioVenta: doc.data().precioVenta * 0.3,
        }));

      const ingredientesUsados = {};
      pedidosSnapshot.docs.forEach((doc) => {
        const ingredientes = doc.data().ingredientes || [];
        ingredientes.forEach((ingrediente) => {
          if (!ingredientesUsados[ingrediente.nombreIngrediente]) {
            ingredientesUsados[ingrediente.nombreIngrediente] = 0;
          }
          ingredientesUsados[ingrediente.nombreIngrediente] += ingrediente.cantidad;
        });
      });

      const datosIngredientes = Object.entries(ingredientesUsados).map(
        ([nombre, cantidad]) => ({
          name: nombre,
          cantidad,
        })
      );

      setDatosDia(datosGananciasDia);
      setDatosMes(datosGananciasMes);
      setDatosAnio(datosGananciasAnio);
      setDatosPie(datosIngredientes);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async () => {
    try {
      const barChartUriDia = await captureRef(barChartRefDia.current, {
        format: "png",
        quality: 1,
        result: "data-uri",
      });

      const barChartUriMes = await captureRef(barChartRefMes.current, {
        format: "png",
        quality: 1,
        result: "data-uri",
      });

      const barChartUriAnio = await captureRef(barChartRefAnio.current, {
        format: "png",
        quality: 1,
        result: "data-uri",
      });

      const pieChartUri = await captureRef(pieChartRef.current, {
        format: "png",
        quality: 1,
        result: "data-uri",
      });

      const html = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #FF69B4; }
            .chart-title { font-size: 18px; font-weight: bold; color: #FF69B4; margin-top: 20px; }
            img { margin: 10px 0; max-width: 100%; }
          </style>
        </head>
        <body>
          <h1>Reportes de Ventas</h1>
          <h2 class="chart-title">Ganancias del Día</h2>
          <img src="${barChartUriDia}" />
          <h2 class="chart-title">Ganancias del Mes</h2>
          <img src="${barChartUriMes}" />
          <h2 class="chart-title">Ganancias del Año</h2>
          <img src="${barChartUriAnio}" />
          <h2 class="chart-title">Ingredientes Más Usados</h2>
          <img src="${pieChartUri}" />
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("PDF Generado", `Archivo PDF creado en ${uri}`);
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reportes</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.graphTitle}>Ganancias del Día</Text>
        <View ref={barChartRefDia} collapsable={false}>
          <BarChart
            data={{
              labels: datosDia.map((_, i) => `P${i + 1}`),
              datasets: [{ data: datosDia.map((item) => item.precioVenta || 0) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="C$"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity) => `rgba(255, 105, 180, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={styles.chartStyle}
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.graphTitle}>Ganancias del Mes</Text>
        <View ref={barChartRefMes} collapsable={false}>
          <BarChart
            data={{
              labels: datosMes.map((_, i) => `P${i + 1}`),
              datasets: [{ data: datosMes.map((item) => item.precioVenta || 0) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="C$"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity) => `rgba(255, 105, 180, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={styles.chartStyle}
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.graphTitle}>Ganancias del Año</Text>
        <View ref={barChartRefAnio} collapsable={false}>
          <BarChart
            data={{
              labels: datosAnio.map((_, i) => `P${i + 1}`),
              datasets: [{ data: datosAnio.map((item) => item.precioVenta || 0) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="C$"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity) => `rgba(255, 105, 180, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={styles.chartStyle}
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.graphTitle}>Ingredientes Más Usados</Text>
        <View ref={pieChartRef} collapsable={false}>
          <PieChart
            data={datosPie.map((item, index) => ({
              name: item.name,
              population: item.cantidad,
              color: coloresPastel[index % coloresPastel.length],
              legendFontColor: "#333",
              legendFontSize: 12,
            }))}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#000",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={generarPDF}>
        <Text style={styles.exportButtonText}>Generar PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fffaf0" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  graphTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  chartContainer: { marginBottom: 20, padding: 10, backgroundColor: "#ffe4e1", borderRadius: 10 },
  chartStyle: { borderRadius: 10 },
  exportButton: {
    backgroundColor: "#FF69B4",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  exportButtonText: { color: "white", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
