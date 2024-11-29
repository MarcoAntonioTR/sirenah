// AlertasDeAcceso.js
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

export const useVerificarAcceso = () => {
    const navigate = useNavigate();

    const verificarYRedirigir = (ruta, rolesPermitidos) => {
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Usted no está autenticado.',
            });
            return;
        }

        let rol;
        try {
            const decodedToken = jwtDecode(token);
            rol = decodedToken.role;
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Error al leer el rol. Intente nuevamente.',
            });
            return;
        }

        if (!rolesPermitidos.includes(rol)) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Usted no tiene rol necesario para acceder a esta opción.',
            });
        } else {
            navigate(ruta);
        }
    };

    return { verificarYRedirigir };
};
