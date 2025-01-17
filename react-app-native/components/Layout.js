import React from 'react';
import { View, StyleSheet } from 'react-native';
import Encabezado from './Encabezado'; // Asegúrate de que la ruta sea correcta

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <Encabezado />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default Layout;
