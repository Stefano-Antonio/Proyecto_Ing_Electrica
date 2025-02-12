import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const HorarioSelectionGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAlumnoData = async () => {
        try {
          // Asegúrate de que "userId" se guarda en localStorage al iniciar sesión
          const response = await axios.get(`/api/alumnos/${localStorage.getItem("userId")}`);
          setHorario(response.data.horario);
        } catch (error) {
          console.error("Error al obtener el horario del alumno", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAlumnoData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Cargando...</div>; // Puedes usar un spinner o similar
  }

  // Si ya existe un horario, redirige a validacion-estatus
  if (horario) {
    return <Navigate to="/validacion-estatus" />;
  }

  // Si no hay horario, permite el acceso a la ruta
  return children;
};

export default HorarioSelectionGuard;
