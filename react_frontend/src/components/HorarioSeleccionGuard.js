import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HorarioSeleccionGuard = ({ children }) => {
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/horario')  // Cambia esto por la API real
            .then(response => {
                console.log("Horario obtenido:", response.data);
                setHorario(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener horario:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Cargando...</p>;  // O un spinner de carga
    }

    return horario ? <Navigate to="/validacion-estatus" /> : children;
};

export default HorarioSeleccionGuard;
