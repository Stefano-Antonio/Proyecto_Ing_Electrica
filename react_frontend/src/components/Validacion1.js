import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Validacion1.css";

function Validacion1() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { materiasSeleccionadas = [] } = location.state || {};

  // Función de validación
  const validarCampos = () => {
    let esValido = true;

    // Validar email
    if (!email) {
      toast.error("El correo es obligatorio.");
      esValido = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("El correo no tiene un formato válido.");
      esValido = false;
    }

    // Validar teléfono
    if (!phone) {
      toast.error("El teléfono es obligatorio.");
      esValido = false;
    } else if (!/^\d{3}\d{3}\d{4}$/.test(phone)) {
      toast.error("El teléfono debe tener el formato 000-000-0000.");
      esValido = false;
    }

    return esValido;
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleContinuarValidacion = () => {
    if (!validarCampos()) {
      return;
    }
    // Si no hay conflictos, navegar a la siguiente página
    navigate("/validacion-estatus");
  };

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
    }

  return (
    <div className="horario-layout">
      <ToastContainer />
      <div className="horario-container">
        <div className="top-left"> 
          <button className="back-button" onClick={handleBack}>Regresar</button> 
        </div>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
        <h2>Verificación de horario</h2>
        <p>Verifique que las materias seleccionadas estén correctas.</p>
        <p>Una vez finalizado el proceso, no se podrán agregar ni quitar materias.</p>

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
          />

          <label htmlFor="phone"> Teléfono: </label>
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
