import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ProtegerRutas = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const previousPath = localStorage.getItem('previousPath') || '/';

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No está autenticado. Por favor, inicie sesión.',
            }).then(() => {
                navigate("/", { replace: true });
            });
            return;
        }

        let role;
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            navigate(previousPath, { replace: true });
            return;
        }

        if (!allowedRoles.includes(role)) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Usted no tiene el rol necesario para acceder a esta ruta.',
            }).then(() => {
                navigate(previousPath, { replace: true });
            });
            console.log("Redirecting to: " + previousPath);
        } else {
            localStorage.setItem('previousPath', window.location.pathname);
        }
    }, [token, allowedRoles, navigate]);

    return children;
};

ProtegerRutas.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtegerRutas;
