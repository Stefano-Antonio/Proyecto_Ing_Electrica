import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./CrearPersonal.css";

function CrearPersonal() {
  const [mostrarModal, setMostrarModal] = useState(false); // Controlar el modal
  const [mostrarCarrera, setMostrarCarrera] = useState(false);
  const [file, setFile] = useState(null); // Almacenar el archivo CSV
  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: "",
    roles: "",
    password: "",
    id_carrera: ""
  });
  
  const carrerasPermitidas = {
    ISftw: "Ing. en Software",
    IDsr: "Ing. en Desarrollo",
    IEInd: "Ing. Electrónica Industrial",
    ICmp: "Ing. Computación",
    IRMca: "Ing. Robótica y Mecatrónica",
    IElec: "Ing. Electricista",
    ISftwS: "Ing. en Software (Semiescolarizado)",
    IDsrS: "Ing. en Desarrollo (Semiescolarizado)",
    IEIndS: "Ing. Electrónica Industrial(Semiescolarizado)",
    ICmpS: "Ing. Computación (Semiescolarizado)",
    IRMcaS: "Ing. Robótica y Mecatrónica (Semiescolarizado)",
    IElecS: "Ing. Electricista (Semiescolarizado)",
  };
  
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL; // Asegúrate de que esta variable esté definida en tu entorno

  const validarMatricula = (matricula) => {
    return /^(CG|AG)\d{4}$|^[A-Z]\d{4}$/.test(matricula);
  };
  

  // Manejo de roles y matricula
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    let prefix = "";
  
    switch (selectedRole) {
      case "D":
        prefix = "P"; // Docente
        break;
      case "T":
        prefix = "T"; // Tutor
        break;
      case "CG":
        prefix = "CG"; // Coordinador General
        break;
      case "C":
        prefix = "C"; // Coordinador
        break;
      case "AG":
        prefix = "AG"; // Administrador
        break;
      case "A":
        prefix = "A"; // Administrador
        break;
      default:
        prefix = "";
    }
  
    setForm((prev) => ({
      ...prev,
      roles: selectedRole,
      matricula: prefix, // Se asigna directamente el prefijo correcto
      id_carrera: selectedRole === "C" || selectedRole === "A" ? prev.id_carrera : "" // Limpiar id_carrera si el rol no lo requiere
    }));
  
    setMostrarCarrera(selectedRole === "C" || selectedRole === "A");
  };
  
  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === "matricula") {
      let newValue = value.toUpperCase(); // Convertir a mayúsculas automáticamente
  
      if (form.roles === "CG" || form.roles === "AG") {
        // Prefijo obligatorio de dos letras
        if (!/^CG\d{0,4}$/.test(newValue) && !/^AG\d{0,4}$/.test(newValue)) {
          return; // Evita entradas inválidas
        }
      } else {
        // Prefijo obligatorio de una sola letra
        if (!/^[A-Z]\d{0,4}$/.test(newValue)) {
          return; // Evita entradas inválidas
        }
      }
  
      setForm((prev) => ({ ...prev, [id]: newValue }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar que si el rol es Coordinador o Administrador, se haya seleccionado una carrera
    if ((form.roles === "C" || form.roles === "A") && !form.id_carrera) {
      toast.error("Debe seleccionar una carrera para el Coordinador o Administrador.");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/api/personal`, form);
      toast.success("Usuario agregado con éxito");
      setForm({
        nombre: "",
        matricula: "",
        correo: "",
        telefono: "",
        roles: "",
        password: "",
        id_carrera: ""
      });
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      if (error.response && error.response.status === 409) { // Check for duplicate error
        const duplicado = error.response.data?.duplicado || ""; // Obtener información del campo duplicado
        toast.error(`Error: El usuario ya existe. Campo duplicado: ${duplicado}`);
      } else {
        toast.error("Hubo un error al agregar el usuario");
      }
    }
  };
  


  const handleBack = () => { 
    navigate("/inicio-coordinador-gen/personal"); // Navegar a la página anterior 
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  //CSV
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Guarda el archivo CSV seleccionado
  };
  
  const handleSubmitCSV = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor selecciona un archivo CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("csv", file);

    try {
      await axios.post(
        `${API_URL}/api/personal/subir-csv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Base de datos actualizada con éxito desde el archivo CSV");
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al subir el archivo CSV:", error);
      toast.error("Hubo un error al actualizar la base de datos");
    }
  };


  const handleSumbitDB = async (e) => {
    setMostrarModal(true);
    return;
  };
  
  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/personal/exportar-csv`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "personal.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo CSV:", error);
      toast.error("No se pudo descargar el archivo.");
    }
  };
  

  return (
    <div className="persona1-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="persona1-container">
        <div className="top-left"> 
          <button className="back-button" onClick={handleBack}>Regresar</button> 
        </div>
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h1>Agregar personal</h1>
        <div className="persona1-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del personal"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="input-wrapper short-field2">
                  <label htmlFor="matricula">ID del usuario</label>
                  <input
                    type="text"
                    id="matricula"
                    placeholder="Seleccione un permiso e ingrese 4 digitos"
                    value={form.matricula}
                    onChange={handleChange}
                    maxLength={form.roles === "CG" || form.roles === "AG" ? 6 : 5} // 6 caracteres para CG y AG, 5 para los demás
                    disabled={!form.roles} // Deshabilitado si no se ha elegido un rol
                  />
                </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  placeholder="alguien@example.com"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="text"
                  id="telefono"
                  placeholder="000-000-0000"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="roles">Permisos</label>
                <select id="roles" value={form.roles} onChange={handleRoleChange} required>
                  <option value="" disabled hidden>Seleccione...</option>
                  <option value="D">Docente</option>
                  <option value="T">Tutor</option>
                  <option value="C">Coordinador</option>
                  <option value="A">Administrador</option>
                  <option value="CG">Coordinador General</option>
                  <option value="AG">Administrador General</option>
                </select>
              </div>

              
            {/* Mostrar campo de carrera solo si es Coordinador o Administrador */}
            {mostrarCarrera && (
                <div className="input-wrapper short-field2">
                  <label htmlFor="id_carrera">Carrera</label>
                  <select id="id_carrera" value={form.id_carrera} onChange={handleChange} required>
                    <option value="" disabled hidden>Seleccione una carrera</option>
                    {Object.entries(carrerasPermitidas).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="input-wrapper short-field2">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="persona1-buttons">
            <button type="submit" disabled={!validarMatricula(form.matricula)}>Agregar</button>
            </div>
          </form>
            <div className="persona1-buttons">
              <button className="button" onClick={handleSumbitDB}>Subir base de datos de personal</button>
            </div>
        </div>
      </div>
      {mostrarModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Subir base de datos</h3>
                  <p>Seleccione el archivo a subir:</p>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                  <button onClick={handleSubmitCSV}>Subir CSV</button>
                  <button onClick={handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              </div>
            )}
    </div>
  );
}

export default CrearPersonal;