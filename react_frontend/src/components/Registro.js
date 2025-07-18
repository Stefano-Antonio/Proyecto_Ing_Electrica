import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Registro.css";

function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState("alumno");
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [mensaje, setMensaje] = useState("");
  const [id_carrera, setIdCarrera] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  
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

  const handleTipoUsuarioChange = (event) => {
    setTipoUsuario(event.target.value);
  };


  const handleCarreraChange = (event) => {
    setIdCarrera(event.target.value);
  };
  
  const HandleForgotPassword = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/personal/password/${matricula}`);
      if (response.status === 200) {
        toast.success("Se ha enviado un correo para la recuperación de contraseña.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("No se pudo enviar el correo de recuperación.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      toast.error("Error al recuperar contraseña. Verifique la matrícula ingresada.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
          ? { matricula, id_carrera } // Se envía id_carrera junto con matrícula
          : { matricula, password };
  
      const response = await axios.post(endpoint, payload);
  
      if (response.status === 200) {
        const { mensaje, roles, token, nombre, id, id_carrera: idCarreraBD, horario, validacionCompleta } = response.data;
  
        // Verificar si la carrera del alumno coincide con la seleccionada
        if (tipoUsuario === "alumno" && idCarreraBD !== id_carrera) {
          toast.error("La matrícula no corresponde a la carrera seleccionada.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
  
        // Verificar si la carrera del personal coincide con la seleccionada (excepto para Docente y Tutor)
        if (tipoUsuario === "personal" && !roles.includes("D") && !roles.includes("T") && !roles.includes("CG") && !roles.includes("AG") && idCarreraBD !== id_carrera) {
          toast.error("La matrícula no corresponde a la carrera seleccionada.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
  
        localStorage.setItem("id_carrera", idCarreraBD);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("matricula", matricula);
        localStorage.setItem("nombreAlumno", nombre);
        localStorage.setItem("IDAlumno", id);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("userType", tipoUsuario);
        localStorage.setItem("horario", JSON.stringify(horario));
        localStorage.setItem("validacionCompleta", validacionCompleta);
  
        // Redirigir según el tipo de usuario
        if (tipoUsuario === "personal") {
          if (roles.includes("D")) {
            navigate("/docente/alumnos", { state: { nombre, matricula } });
          } else if (roles.includes("C")) {
            if (!id_carrera) {
              toast.error("Por favor, selecciona una carrera antes de continuar.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }
            navigate("/coordinador", { state: { nombre, matricula, id_carrera } });
          } else if (roles.includes("A")) {
            if (!id_carrera) {
              toast.error("Por favor, selecciona una carrera antes de continuar.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }
            navigate("/administrador", { state: { nombre, matricula, id_carrera } });
          } else if (roles.includes("T")) {
            navigate("/tutor", { state: { nombre, matricula } });
          } else if (roles.includes("CG")) {
            navigate("/inicio-coordinador-gen", { state: { nombre, matricula } });
          }
          else if (roles.includes("AG")) {
            navigate("/inicio-administrador-gen", { state: { nombre, matricula } });
          } else {
            setMensaje("Usuario personal desconocido");
          }
        } else if (tipoUsuario === "alumno") {
          if (horario) {
            if (!id_carrera) {
              toast.error("Por favor, selecciona una carrera antes de continuar.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }
            navigate("/validacion-estatus", { state: { nombre, id, id_carrera, horario } });
          } else if (carrerasPermitidas.hasOwnProperty(idCarreraBD)) {
            if (!id_carrera) {
              toast.error("Por favor, selecciona una carrera antes de continuar.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }
            navigate("/horario-seleccion/", { state: { nombre, id, id_carrera, horario } });
          } else {
            setMensaje("Usuario no encontrado");
          }
        } else {
          setMensaje("Usuario desconocido");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión. Matrícula o contraseña incorrectas.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
   

  
  return (
    <div className="registro-layout">
      <ToastContainer />
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

          <div className="field-group"></div>
          <div className="field-group">
            <label>Carrera </label>
            <select value={id_carrera} onChange={handleCarreraChange} required>
              <option value="">Seleccione una carrera...</option>
              {Object.entries(carrerasPermitidas).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  style={{ width: '100%' }}
                />
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '-30px', display: 'flex', alignItems: 'center' }}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-7.06" />
                        <path d="M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002a5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                <button
                  className="forgot-button"
                  type="button"
                  onClick={HandleForgotPassword}
                >
                  Olvidé mi contraseña
                </button>
              </div>
            )}
            <div className="button-group">
              <button className="login-button" type="submit">Iniciar sesión</button>
            </div>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default Registro;
