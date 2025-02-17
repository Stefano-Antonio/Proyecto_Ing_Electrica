import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Validacion2.css";

function Validacion2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [archivo, setArchivo] = useState(null); // Estado para almacenar el archivo seleccionado
  const [archivoSubido, setArchivoSubido] = useState(false); // Estado para indicar si el archivo fue subido
  const [archivoURL, setArchivoURL] = useState(""); // URL temporal del archivo para previsualización/descarga
  const [matricula, setMatricula] = useState(localStorage.getItem("matricula"));
  const [nombreAlumno, setNombreAlumno] = useState(location.state?.nombre || "");
  const [IDAlumno, setIDAlumno] = useState(location.state?._id || "");

      // 🔒 Evitar que el usuario regrese a la pantalla anterior con el botón de retroceso
  useEffect(() => {
    const bloquearAtras = () => {
      window.history.pushState(null, null, window.location.href);
    };

    bloquearAtras();
    window.addEventListener("popstate", bloquearAtras);

    return () => {
      window.removeEventListener("popstate", bloquearAtras);
    };
  }, []);

    useEffect(() => {
      const nombre = location.state?.nombre || localStorage.getItem("nombreAlumno");
      setNombreAlumno(nombre || "Alumno desconocido");
    }, [location.state]);
  
    useEffect(() => {
      const idAlumno = location.state?.id || localStorage.getItem("IDAlumno");
      setIDAlumno(idAlumno || "ID desconocido");
    }, [location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setArchivo(file);
      setArchivoURL(URL.createObjectURL(file)); // Generar URL temporal
    } else {
      alert("Por favor, selecciona un archivo PDF válido.");
    }
  };

  const handleSubirComprobante = () => {
    if (archivo) {
      console.log("Archivo subido:", archivo);
      setArchivoSubido(true);
      alert("El comprobante de pago se ha subido correctamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className="validacion-layout">
      <div className="validacion-container">
        <h2>Validación de horario</h2>
        <h4><strong>{nombreAlumno || "Cargando..."}</strong></h4>
        <h4>Matricula: <strong>{matricula || "Cargando..."}</strong></h4>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <p>
          Tu horario está en proceso de validación por parte del tutor. Una vez
          validado y subiendo tu comprobante de pago, podrás descargar tu
          horario para poder continuar con tu proceso.
        </p>
        <div className="same-line">
          <h3 className="center-text">Estatus de horario: En proceso</h3>
        </div>

        <div className="validacion-buttons">
          <div className="file-upload-container">
            <label htmlFor="archivo" className="button-validar">
              Subir archivo
            </label>
            <input
              id="archivo"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }} // Oculta el input estándar
            />
            <span className="archivo-mensaje">{archivo ? archivo.name : "Ningún archivo seleccionado"}</span>
          </div>
        </div>
        <div className="validacion-buttons">
          <button
            className="button"
            onClick={handleSubirComprobante}
            disabled={!archivo} // Deshabilitado si no hay archivo seleccionado
          >
            Subir comprobante de pago
          </button>
        </div>

        {archivoSubido && (
          <div className="archivo-info">
            <a href={archivoURL} download={archivo.name} className="button">
              Descargar comprobante
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Validacion2;
