import React from "react";
import "./RevisionHorarioTutor.css";


function RevisionHorarioTutor() {
    return (
        <div className="horario-layout">
        
        <div className="horario-container">
            <div className="horario-header">
            <h3>Nombre del alumno: Juan Perez    </h3>     <h3>Semestre: 2do</h3>
            <h3>Carrera: Ingeniería en desarrollo</h3>
            </div>


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
                      <tr>
                        <td>1A</td>
                        <td>101</td>
                        <td>Algebra Lineal</td>
                        <td>8:30-10:00</td>
                        <td>-</td>
                        <td>10:00-11:30</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>

              </tbody>
            </table>
          </div>
          <div className="comments-validation-wrapper">
            <div className="comments-section">
              <h3>Comentarios</h3>
              <textarea placeholder="Ingrese comentarios en caso de tenerlos."></textarea>
            </div>
            <div class="validation-section">
              <h3>Validación</h3>
              <div className="checkbox-group">
                <input type="radio" id="accepted" name="validation"/>
                <label for="accepted">Aceptado</label>
              </div>
              <div className="checkbox-group">
                <input type="radio" id="rejected" name="validation"/>
                <label for="rejected">Rechazado</label>
              </div>
              <button class="submit-btn">Guardar</button>
          </div>
        </div>

        </div>
        </div>

        
      );
    }

export default RevisionHorarioTutor;