import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/index";

const PrivateRoute = ({ children, requiredRole }) => {
    const { currentUser, loading, hasRole } = useAuth();

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/admin/auth" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;