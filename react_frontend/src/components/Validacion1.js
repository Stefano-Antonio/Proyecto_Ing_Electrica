
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import "./Validacion1.css";

function Validacion1() {
  const location = useLocation();
  const navigate = useNavigate();
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { materiasSeleccionadas = [] } = location.state || {};

  useEffect(() => {
    const fetchAlumnoData = async () => {
      const IDAlumno = location.state?.IDAlumno || localStorage.getItem("IDAlumno");
      if (!IDAlumno) {
        toast.error("No se encontró el ID del alumno.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/alumnos/${IDAlumno}`
        );
        const { _id, nombre, correo, telefono } = response.data;
        setNombreAlumno(nombre);
        setEmail(correo);
        setPhone(telefono);
        console.log("Datos del alumno obtenidos:", response.data);
            if (_id) {
              localStorage.setItem("IDAlumno", _id);
            } else {
              console.error("Error: El ID del alumno no está en la respuesta del backend.");
            }

         // Guardamos el ID del alumno en localStorage
      localStorage.setItem("IDAlumno", _id);
      } catch (error) {
        console.error("Error al obtener los datos del alumno:", error);
        toast.error("Error al obtener los datos del alumno.");
      }
    };

    fetchAlumnoData();
  }, []);

  // Función de validación
  const validarCampos = () => {
    let esValido = true;

    if (!email) {
      toast.error("El correo es obligatorio.");
      esValido = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("El correo no tiene un formato válido.");
      esValido = false;
    }

    if (!phone) {
      toast.error("El teléfono es obligatorio.");
      esValido = false;
    } else if (!/^\d{10}$/.test(phone)) {
      toast.error("El teléfono debe tener 10 dígitos.");
      esValido = false;
    }

    return esValido;
  };

  const handleContinuarValidacion = async () => {
    if (!validarCampos()) return;

    const IDAlumno = location.state?.IDAlumno || localStorage.getItem("IDAlumno");
      if (!IDAlumno) {
        toast.error("No se encontró el ID del alumno.");
        return;
      }

    try {
      await axios.put(`http://localhost:5000/api/alumnos/${IDAlumno}`, {
        correo: email,
        telefono: phone,
        materiasSeleccionadas: materiasSeleccionadas, // Enviar las materias seleccionadas
      });
      toast.success("Datos actualizados correctamente.");
      navigate("/validacion-estatus");
    } catch (error) {
      console.error("Error al actualizar los datos del alumno:", error);
      toast.error("Error al actualizar los datos del alumno.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="horario-layout">
      <ToastContainer />
      <div className="horario-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>
            Regresar
          </button>
        </div>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
        <h2>Verificación de horario</h2>
        <p>
          Bienvenido(a): <strong>{nombreAlumno || "Cargando..."}</strong>
        </p>
        <p>Verifique que las materias seleccionadas estén correctas.</p>
        <p>
          Una vez finalizado el proceso, no se podrán agregar ni quitar
          materias.
        </p>

        <div className="horario-content">
          <table className="horario-table">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Salón</th>
                <th>Materia</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
              </tr>
            </thead>
            <tbody>
              {materiasSeleccionadas.map((materia, index) => (
                <tr key={index}>
                  <td>{materia.grupo}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.horarios.lunes || "—"}</td>
                  <td>{materia.horarios.martes || "—"}</td>
                  <td>{materia.horarios.miercoles || "—"}</td>
                  <td>{materia.horarios.jueves || "—"}</td>
                  <td>{materia.horarios.viernes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico: </label>
          <input
            type="email"
            id="email"
            placeholder="alguien@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="phone">Teléfono: </label>
          <input
            type="tel"
            id="phone"
            placeholder="000-000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="horario-buttons">
          <button className="button" onClick={handleContinuarValidacion}>
            Inscribir materias
          </button>
        </div>
      </div>
    </div>
  );
}

export default Validacion1;
