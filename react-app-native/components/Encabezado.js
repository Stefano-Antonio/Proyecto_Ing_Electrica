import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Encabezado = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo_uaz.png')} style={styles.headerLogoUaz} />
      <View style={styles.headerTitle}>
        <Text style={styles.title}>Universidad Autónoma de Zacatecas</Text>
        <Text style={styles.highlight}>Facultad de Ingeniería Eléctrica</Text>
      </View>
      <Image source={require('../assets/logo_uaei.png')} style={styles.headerLogoUaei} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Espaciar los elementos uniformemente
    backgroundColor: '#002a5c',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Asegura que no tape la barra de estado
    paddingBottom: 10,
    paddingHorizontal: 10,
    width: screenWidth, // Asegurar que el encabezado ocupe todo el ancho de la pantalla
  },
  headerLogoUaz: {
    width: 60, // Ajustar el tamaño para móviles
    height: 60, // Ajustar el tamaño para móviles
    resizeMode: 'contain', // Asegurar que la imagen mantenga su relación de aspecto
  },
  headerLogoUaei: {
    width: 60, // Ajustar el tamaño para móviles
    height: 60, // Ajustar el tamaño para móviles
    resizeMode: 'contain', // Asegurar que la imagen mantenga su relación de aspecto
  },
  headerTitle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18, // Ajustar el tamaño de la fuente para móviles
    color: '#af7800',
    textAlign: 'center', // Asegurar que el texto esté centrado
  },
  highlight: {
    fontSize: 16, // Ajustar el tamaño de la fuente para móviles
    color: 'white',
    textAlign: 'center', // Asegurar que el texto esté centrado
  },
});

export default Encabezado;
