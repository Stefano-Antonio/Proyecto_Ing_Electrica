import React from "react";
import { Navigate } from "react-router-dom";

const RedirectRoute = ({ children, userType }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const roles = localStorage.getItem("roles");

    const getPersonalRedirectRoute = () => {
        if (roles.includes("D")) {
            return "/inicio-docente";
        } else if (roles.includes("C")) {
            return "/inicio-coordinador";
        } else if (roles.includes("A")) {
            return "/inicio-administrador";
        }
        return "/";
    };

    if (isAuthenticated) {
        if (userType === "alumno") {
            return <Navigate to="/horario-seleccion" />;
        } else if (userType === "personal" && roles) {
            return <Navigate to={getPersonalRedirectRoute()} />;
        }
    }

    return children;
};

export default RedirectRoute;
