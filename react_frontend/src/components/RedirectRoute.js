import React, { useEffect, useState } from "react";
import { Navigate, NavigationType } from "react-router-dom";
import axios from "axios";  // Importa axios para hacer la consulta al backend

const RedirectRoute = ({ children, userType }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const roles = localStorage.getItem("roles");
    const [horario, setHorario] = useState(null); // Estado para el horario
    const [loading, setLoading] = useState(true); // Estado de carga para asegurarnos de que los datos se hayan cargado
    const [validacionCompleta, setValidacionCompleta] = useState(false);

    const getPersonalRedirectRoute = () => {
        if (roles.includes("D")) {
            return "/docente/alumnos";
        } else if (roles.includes("C")) {
            return "/coordinador";
        } else if (roles.includes("A")) {
            return "/administrador";
        } else if (roles.includes("T")){
            return "/inicio-tutor";
        } else if (roles.includes("CG")){
            return "/inicio-coordinador-gen";
        } else if (roles.includes("AG")){
            return "/inicio-administrador-gen";
        }
        return "/"; // Ruta por defecto
    };

    // Verificar si el alumno tiene un horario guardado
    useEffect(() => {
        if (isAuthenticated && userType === "alumno") {
            const fetchAlumnoData = async () => {
                try {
                    const response = await axios.get(`/api/alumnos/${localStorage.getItem("IDAlumno")}`);
                    setHorario(response.data.horario);  // Establecer el horario
                    setValidacionCompleta(response.data.validacionCompleta); // Nuevo estado
                    setLoading(false); // Datos cargados
                } catch (error) {
                    console.error("Error al obtener los datos del alumno", error);
                    setLoading(false); // Error en la carga
                }
            };
            fetchAlumnoData();
        } else {
            setLoading(false);  // No es alumno, terminamos la carga
        }
    }, [isAuthenticated, userType]);

    // Mientras se carga, no hacemos redirección, solo mostramos la página
    if (loading) {
        return <div>Cargando...</div>;  // O puedes mostrar un spinner o cualquier indicador de carga
    }

    // Redirigir en función del horario
    if (isAuthenticated) {
        if (userType === "alumno") {
            if (horario) {
                // Si el alumno ya tiene un horario, redirigir a la página de validación de estatus
                return <Navigate to="/validacion-estatus" />;
            }else if(!horario){
                return <Navigate to="/horario-seleccion" />;
            }
        } else if (userType === "personal" && roles) {
            return <Navigate to={getPersonalRedirectRoute()} />;
        }
    }

    return children;
};

export default RedirectRoute;
