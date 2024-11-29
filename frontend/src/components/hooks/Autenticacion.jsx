import { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";

const Autenticacion = () => {


    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            
            const decodedToken = jwtDecode(token);
            setIsAuthenticated(true);
            setUserRole(decodedToken.role);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);

    return { isAuthenticated, userRole };

}

export default Autenticacion
