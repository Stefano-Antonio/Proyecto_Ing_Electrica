import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState("alumno");
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleTipoUsuarioChange = (event) => {
    setTipoUsuario(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const endpoint =
        tipoUsuario === "alumno"
          ? "http://localhost:5000/api/auth/alumno/login"
          : "http://localhost:5000/api/auth/personal/login";
  
      const payload =
        tipoUsuario === "alumno"
          ? { matricula }
          : { matricula, password };
  
      const response = await axios.post(endpoint, payload);
  
      if (response.status === 200) {
        const { mensaje, roles, token, nombre, id, horario, validacionCompleta  } = response.data;
  
        setMensaje(mensaje);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("matricula", matricula);
        localStorage.setItem("nombreAlumno", nombre);
        localStorage.setItem("IDAlumno", id);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("userType", tipoUsuario); // Almacena el tipo de usuario
        localStorage.setItem("horario", JSON.stringify(horario));  // Guardar el horario
        localStorage.setItem("validacionCompleta", validacionCompleta); // Guarda validación

        // Redirigir según el tipo de usuario
        if (tipoUsuario === "personal") {
          if (roles.includes("D")) {
            navigate("/inicio-docente", { state: { nombre } });
          } else if (roles.includes("C")) {
            navigate("/inicio-coordinador", { state: { nombre } });
          } else if (roles.includes("A")) {
            navigate("/inicio-administrador", { state: { nombre } });
          } else if (roles.includes("T")) {
            navigate("/inicio-tutor", { state: { nombre } });
          } else {
            setMensaje("Usuario personal desconocido");
          }
        } else if (tipoUsuario === "alumno") {
          if (horario) {
            navigate("/validacion-estatus", {state: { nombre, id, horario }});
          } else{
            navigate("/horario-seleccion/", { state: { nombre, id, horario } });
          }
          
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
    <div className="registro-layout">
      <div className="registro-container">
        <h1>¡Bienvenido!</h1>
        <p>A continuación, seleccione el tipo de sesión</p>

        <div className="session-selection">
          <h2>Selección de sesión</h2>
          <div className="field-group">
            <label>Tipo de usuario</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="usuario"
                  value="alumno"
                  checked={tipoUsuario === "alumno"}
                  onChange={handleTipoUsuarioChange}
                />{" "}
                Alumno
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="usuario"
                  value="personal"
                  checked={tipoUsuario === "personal"}
                  onChange={handleTipoUsuarioChange}
                />{" "}
                Personal
              </label>
            </div>
          </div>

          <div className="field-group">
            <label>Carrera </label>
            <select>
              <option value="">Seleccione una carrera...</option>
              <option value="Ingenieria en software">Ingenieria en software</option>
              <option value="Ingenieria electronica">Ingenieria electronica</option>
              <option value="Ingenieria automotriz">Ingenieria automotriz</option>
              {/* Agrega más opciones según tus necesidades */}
            </select>
          </div>
        </div>
      </div>

      <div className="registro-container">
        <h1>Ingrese sus credenciales</h1>
        <p>A continuación</p>
        <div className="login-section">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label>Matrícula</label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Matrícula"
                required
              />
            </div>
            {tipoUsuario === "personal" && (
              <div className="field-group">
                <label>Contraseña </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
            )}
            <button className="login-button" type="submit">Iniciar sesión</button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default Registro;
