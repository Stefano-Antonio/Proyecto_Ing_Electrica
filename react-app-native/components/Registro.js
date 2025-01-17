import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

function Registro({ navigation }) {
  const [tipoUsuario, setTipoUsuario] = useState("alumno");
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleTipoUsuarioChange = (tipo) => {
    setTipoUsuario(tipo);
  };

  const handleLogin = async () => {
    try {
      const endpoint =
        tipoUsuario === "alumno"
          ? "http://192.168.1.145:5000/api/auth/alumno/login"
          : "http://192.168.1.145:5000/api/auth/personal/login";

      const payload =
        tipoUsuario === "alumno"
          ? { matricula }
          : { matricula, password };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        const { mensaje, roles, token, nombre } = response.data;

        setMensaje(mensaje);
        // Aquí puedes usar AsyncStorage en lugar de localStorage para almacenar datos
        // AsyncStorage.setItem("isAuthenticated", "true");
        // AsyncStorage.setItem("matricula", matricula);
        // AsyncStorage.setItem("nombre", nombre);
        // AsyncStorage.setItem("roles", JSON.stringify(roles));
        // AsyncStorage.setItem("userType", tipoUsuario);

        // Redirigir según el tipo de usuario
        if (tipoUsuario === "personal") {
          if (roles.includes("D")) {
            navigation.navigate("InicioDocente", { nombre });
          } else if (roles.includes("C")) {
            navigation.navigate("InicioCoordinador", { nombre });
          } else if (roles.includes("A")) {
            navigation.navigate("InicioAdministrador", { nombre });
          } else {
            setMensaje("Usuario personal desconocido");
          }
        } else if (tipoUsuario === "alumno") {
          navigation.navigate("HorarioSeleccion", { nombre });
        } else {
          setMensaje("Usuario desconocido");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("Error al iniciar sesión. Matrícula o contraseña incorrectas.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.registroLayout}>
      <View style={styles.registroContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text>A continuación, seleccione el tipo de sesión</Text>

        <View style={styles.sessionSelection}>
          <Text style={styles.subtitle}>Selección de sesión</Text>
          <View style={styles.fieldGroup}>
            <Text>Tipo de usuario</Text>
            <View style={styles.radioGroup}>
              <Button
                title="Alumno"
                onPress={() => handleTipoUsuarioChange("alumno")}
                color={tipoUsuario === "alumno" ? "#002a5c" : "#ccc"}
              />
              <Button
                title="Personal"
                onPress={() => handleTipoUsuarioChange("personal")}
                color={tipoUsuario === "personal" ? "#002a5c" : "#ccc"}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text>Carrera </Text>
            <TextInput
              placeholder="Seleccione una carrera..."
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
        </View>
      </View>

      <View style={styles.registroContainer}>
        <Text style={styles.title}>Ingrese sus credenciales</Text>
        <Text>A continuación</Text>
        <View style={styles.loginSection}>
          <Text style={styles.subtitle}>Iniciar sesión</Text>
          <View style={styles.fieldGroup}>
            <Text>Matrícula</Text>
            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Matrícula"
              required
            />
          </View>
          {tipoUsuario === "personal" && (
            <View style={styles.fieldGroup}>
              <Text>Contraseña </Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
                required
              />
            </View>
          )}
          <Button title="Iniciar sesión" onPress={handleLogin} />
          {mensaje && <Text>{mensaje}</Text>}
        </View>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  registroLayout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  registroContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#002a5c",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#002a5c",
  },
  fieldGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default Registro;
