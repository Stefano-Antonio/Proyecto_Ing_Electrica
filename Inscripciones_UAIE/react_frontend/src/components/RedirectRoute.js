import React from "react";
import {Navigate} from "react-router-dom";

const RedirectRoute = ({children, userType}) => {
    //Verifica si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    //Redirecciona según el tipo de usuario

    if(isAuthenticated){
        return <Navigate to={userType === "alumno" ? "/horario-seleccion" : "/inicio-tutor"} />;
    }

    return children;
};

export default RedirectRoute;
