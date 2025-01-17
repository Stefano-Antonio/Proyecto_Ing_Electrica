import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "./Validacion1.css";

function Validacion1() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { materiasSeleccionadas = [] } = location.state || {};

  // Función de validación
  const validarCampos = () => {
    const mensajesErrores = [];

    // Validar email
    if (!email) {
      mensajesErrores.push("El correo es obligatorio.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      mensajesErrores.push("El correo no tiene un formato válido.");
    }

    // Validar teléfono
    if (!phone) {
      mensajesErrores.push("El teléfono es obligatorio.");
    } else if (!/^\d{3}\d{3}\d{4}$/.test(phone)) {
      mensajesErrores.push("El teléfono debe tener el formato 000-000-0000.");
    }

    if (mensajesErrores.length > 0) {
      alert(mensajesErrores.join("\n"));
      return false;
    }

    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const generarCSV = () => {
    if (materiasSeleccionadas.length === 0) {
      alert("No hay materias seleccionadas para descargar.");
      return;
    }

    // Encabezados del archivo CSV
    const encabezados = [
      "Nombre",
      "Grupo",
      "Salon",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
    ];

    // Convertir materias a formato CSV
    const filas = materiasSeleccionadas.map((materia) => [
      materia.nombre,
      materia.grupo,
      materia.salon,
      materia.horarios.lunes || "—",
      materia.horarios.martes || "—",
      materia.horarios.miercoles || "—",
      materia.horarios.jueves || "—",
      materia.horarios.viernes || "—",
    ]);

    // Crear contenido CSV
    const contenidoCSV = [
      encabezados.join(","), // Agregar encabezados
      ...filas.map((fila) => fila.join(",")), // Agregar cada fila
    ].join("\n");

    // Crear un archivo Blob con el contenido
    const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });

    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "materias_seleccionadas.csv";

    // Simular clic en el enlace para descargar
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };

  const handleContinuarValidacion = () => {
    if (!validarCampos()) {
      return;
    }
    // Si no hay conflictos, navegar a la siguiente página
    navigate("/validacion-estatus");
  };

  return (
    <div className="horario-layout">
      <div className="horario-container">
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
          <button className="button" onClick={() => navigate(-1)}>
            Regresar
          </button>
          <button className="button" onClick={handleContinuarValidacion}>
            Inscribir materias
          </button>
          <button className="button" onClick={generarCSV}>
            Descargar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Validacion1;
