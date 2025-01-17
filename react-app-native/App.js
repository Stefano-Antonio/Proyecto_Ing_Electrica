import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registro from './components/Registro';
import Layout from './components/Layout'; // Asegúrate de que la ruta sea correcta
import HorarioSeleccion from './components/HorarioSeleccion';

const Stack = createStackNavigator();

const App = () => {
  const screenOptions = {
    headerShown: false, // Ocultar el encabezado por defecto de React Navigation
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registro" screenOptions={screenOptions}>
        <Stack.Screen name="Registro" component={props => (
          <Layout>
            <Registro {...props} />
          </Layout>
        )} />
        <Stack.Screen name="HorarioSeleccion" component={props => (
          <Layout>
            <HorarioSeleccion {...props} />
          </Layout>
        )} />
        {/* Agrega otras pantallas de la misma manera */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
