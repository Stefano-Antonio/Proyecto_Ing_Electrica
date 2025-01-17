import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from 'react-native';


function HorarioSeleccion() {
  const navigation = useNavigation();
  const route = useRoute();
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [conflictos, setConflictos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreAlumno, setNombreAlumno] = useState(route.params?.nombre || "");
  const [matricula, setMatricula] = useState(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch("http://192.168.1.145:5000/api/materias");
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.grupo.localeCompare(b.grupo));
        setMaterias(sortedData);

        const uniqueGroups = [...new Set(data.map((materia) => materia.grupo))];
        setGrupos(uniqueGroups);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    };

    fetchMaterias();
  }, []);

  useEffect(() => {
    const nombre = route.params?.nombre || null;
    setNombreAlumno(nombre || "Alumno desconocido");
    setMatricula(null); // Ajusta según tu lógica de almacenamiento
  }, [route.params]);

  const handleDesactivarTodas = () => {
    setMateriasSeleccionadas([]);
  };

  const handleLogout = () => {
    navigation.navigate("Login"); // Navegar a la pantalla de inicio de sesión
  };

  const handleCheckboxChange = (materia, checked) => {
    if (checked) {
      setMateriasSeleccionadas((prev) => [...prev, materia]);
    } else {
      setMateriasSeleccionadas((prev) =>
        prev.filter((selected) => selected !== materia)
      );
    }
  };

  const isMateriaSeleccionada = (materia) => {
    return materiasSeleccionadas.includes(materia);
  };

  const hayTraslape = (horario1, horario2) => {
    const convertirHora = (hora) => {
      const [h, m] = hora.split(":").map(Number);
      return h * 60 + m;
    };

    const [inicio1, fin1] = horario1.map(convertirHora);
    const [inicio2, fin2] = horario2.map(convertirHora);

    return !(fin1 <= inicio2 || fin2 <= inicio1);
  };

  const validarTraslapes = () => {
    const conflictos = [];

    materiasSeleccionadas.forEach((materiaA, index) => {
      const horariosA = Object.entries(materiaA.horarios);
      materiasSeleccionadas.slice(index + 1).forEach((materiaB) => {
        const horariosB = Object.entries(materiaB.horarios);

        horariosA.forEach(([diaA, horarioA]) => {
          if (horarioA) {
            const horarioB = horariosB.find(([diaB, _]) => diaB === diaA)?.[1];

            if (
              horarioB &&
              hayTraslape(horarioA.split("-"), horarioB.split("-"))
            ) {
              conflictos.push({
                materiaA: materiaA.nombre,
                materiaB: materiaB.nombre,
              });
            }
          }
        });
      });
    });

    return conflictos;
  };

  const handleContinuarValidacion = () => {
    const conflictosDetectados = validarTraslapes();
    if (conflictosDetectados.length > 0) {
      setConflictos(conflictosDetectados);
      setMostrarModal(true);
      Alert.alert("TRASLAPE DE MATERIAS", "Existe un empalme en las siguientes materias: " + conflictosDetectados.map(conflicto => `${conflicto.materiaA} y ${conflicto.materiaB}`).join(", "));
      return;
    }
    
    navigation.navigate("Validacion", { materiasSeleccionadas });
  };

  const handleGrupoChange = (itemValue) => {
    setGrupoSeleccionado(itemValue);
  };

  const materiasFiltradas = grupoSeleccionado
    ? materias.filter((materia) => materia.grupo === grupoSeleccionado)
    : materias;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "flex-end" }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Sistema de selección de horario
      </Text>
      <Text>Bienvenido(a): <Text style={{ fontWeight: "bold" }}>{nombreAlumno || "Cargando..."}</Text></Text>
      <Text style={{ marginBottom: 20 }}>A continuación, seleccione las materias que va a cargar en el semestre</Text>
      
      <Picker selectedValue={grupoSeleccionado} onValueChange={handleGrupoChange} style={{ height: 50, width: "100%" }}>
        <Picker.Item label="Seleccionar grupo..." value="" />
        {grupos.map((grupo, index) => (
          <Picker.Item key={index} label={grupo} value={grupo} />
        ))}
      </Picker>
      
      <FlatList
        data={materiasFiltradas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", marginVertical: 5 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 2,
                backgroundColor: isMateriaSeleccionada(item) ? "#d3f4ff" : "white",
              }}
              onPress={() => handleCheckboxChange(item, !isMateriaSeleccionada(item))}
            >
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button title="Desactivar todas" onPress={handleDesactivarTodas} />
        <Button
          title="Continuar a validación"
          onPress={handleContinuarValidacion}
          disabled={materiasSeleccionadas.length === 0}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  horarioLayout: {
    flex: 1,
    width: '100%',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#e0e0e0',
  },
  horarioContainer: {
    position: 'relative',
    flex: 1,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  horarioContainerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002a5c',
  },
  horarioContainerParagraph: {
    color: '#555',
  },
  horarioContent: {
    margin: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horarioTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 20,
    overflowX: 'auto',
  },
  horarioTableCell: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    textAlign: 'center',
  },
  horarioTableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  horarioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  scrollableTable: {
    maxHeight: 250,
    overflowY: 'auto',
  },
  button: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#002a5c',
    color: 'white',
    borderWidth: 0,
    cursor: 'pointer',
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#003a8c',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#a0a0a0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  buttonDisabledHover: {
    backgroundColor: '#e0e0e0',
  },
  topRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: 'white',
    borderWidth: 0,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  logoutButtonHover: {
    backgroundColor: '#d32f2f',
  },
  fieldGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  fieldGroupLabel: {
    width: 100,
    marginRight: 10,
    textAlign: 'left',
  },
  fieldGroupSelect: {
    flex: 1,
    minWidth: 0,
    padding: 8,
    marginTop: 5,
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalContentHeader: {
    marginTop: 0,
    color: '#b71c1c',
  },
  modalContentList: {
    listStyle: 'none',
    padding: 0,
    margin: 10,
    color: '#d32f2f',
    textAlign: 'left',
  },
  modalContentButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#b71c1c',
    color: '#fff',
    borderWidth: 0,
    borderRadius: 4,
  },
  modalContentButtonHover: {
    backgroundColor: '#d32f2f',
  },
});


export default HorarioSeleccion;
