import React from 'react';
import logo_uaz from '../assets/logo_uaz.png'; 
import logo_uaei from '../assets/logo_uaei.png';

function Encabezado() {
  return (
    <div className="header">
      <img src={logo_uaz} alt="logo" className="header-logo_uaz" />
      <div className="header-title">
        Universidad Autónoma de Zacatecas<br />
        <span className="highlight">Facultad de Ingeniería Eléctrica</span>
        </div>
      <img src={logo_uaei} alt="logo" className="header-logo_uaei" />
    </div>
  );
}

export default Encabezado;
