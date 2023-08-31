import React, { useContext } from 'react'
import { AuthContext } from "../context/auth";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router"

const PrivateRoute = ({ element: Element, ...rest }) => {
    // grab user from context
    const { user } = useContext(AuthContext);
    const location = useLocation()

    
    return (
        // check is user is authenticated to see page, otherwise redirect to login page
        // replace state={{ from: location }}
       
        user ? <Outlet /> : <Navigate to="/login" /> 
        
        );
    };

export default PrivateRoute
