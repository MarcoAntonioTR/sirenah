import { useState } from 'react';
import { FaEnvelope, FaLock, FaFacebookF, FaGoogle, FaTwitter, FaTimes } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../../styles/Login.css';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import { AlertaDeExito } from '../../utils/Alertas';
import {useNavigate} from 'react-router-dom'
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
    
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!regexEmail.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            setSuccess('');
            return;
        }
    
        if (password.length < 5) {
            setError('La contraseña debe tener al menos 5 caracteres.');
            setSuccess('');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:9090/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json(); 
            
            if (data.statuscode === 200) {
                localStorage.setItem('token',data.token);
                const role = jwtDecode(data.token).role;

                AlertaDeExito('!Bienvenido!', 'Has iniciado sesión correctamente.');
                setError('');
                if (role === 'ADMIN') {
                    setTimeout(() => {
                        navigate('/MenuAdmin/Perfil');
                        window.location.reload();
                    }, 2000);
                } else if (role === 'EMPLEADO') {
                    setTimeout(() => {
                        navigate('/MenuAdmin/Perfil');
                        window.location.reload();
                    }, 2000);
                } else if (role === 'USER') {
                    setTimeout(() => {
                        navigate('/MenuCliente/Perfil');
                        window.location.reload();
                    }, 2000);
                }
                
            } else if (data.statuscode === 401) {
                setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
                setSuccess('');
            } else if (data.statuscode === 404) {
                setError('Usuario no encontrado. Verifica tu correo electrónico o regístrate.');
                setSuccess('');
            } else if (data.statuscode === 500) {
                setError('Hubo un problema con el servidor. Intenta nuevamente.');
                setSuccess('');
            } else {
                setError('Error en el inicio de sesión. Intenta nuevamente.');
                setSuccess('');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Error en la conexión con el servidor. Intenta nuevamente.');
            setSuccess('');
        }
    };

    const alternarVisibilidadPassword = () => {
        setMostrarPassword(!mostrarPassword);
    };

    return (
        <div className="contenedor-login1">
            <button className="btn-close" onClick={() => window.location.href = '/'}>
                <FaTimes className="icon-close" />
            </button>
            <form onSubmit={manejarEnvio} className="formulario-login1">
                <h2 className="titulo-login1">¡Bienvenido de nuevo!</h2>
                <p className="subtitulo-login1">Por favor, inicia sesión en tu cuenta</p>

                {/* Campo de Email */}
                <div className="grupo-input1">
                    <label className="etiqueta1">Correo Electrónico:</label>
                    <div className="input-con-icono1">
                        <FaEnvelope className="icono1" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                            className="input-login1"
                        />
                    </div>
                </div>

                {/* Campo de Contraseña */}
                <div className="grupo-input1">
                    <label className="etiqueta1">Contraseña:</label>
                    <div className="input-con-icono1">
                        <FaLock className="icono1" />
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                            className="input-login1"
                        />
                    </div>
                </div>

                {/* Botón para mostrar/ocultar contraseña */}
                <button
                    type="button"
                    onClick={alternarVisibilidadPassword}
                    className="btn-mostrar-password1"
                >
                    {mostrarPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    {mostrarPassword ? ' Ocultar contraseña' : ' Mostrar contraseña'}
                </button>

                {/* Enlace de contraseña olvidada */}
                <div className="forgot-password1">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                {/* Botón de Login */}
                <button type="submit" className="boton-login1">
                    Iniciar sesión
                </button>

                {/* Mensajes de error y éxito */}
                {error && <p className="error-message1">{error}</p>}
                {success && <p className="success-message1">{success}</p>}
                <p className="parrafo-login1">
                    ¿No tienes una cuenta? <Link to="/Registro">Regístrate aquí</Link>
                </p>
                {/* Login con redes sociales */}
                <div className="social-login1">
                    <p>O inicia sesión con:</p>
                    <div className="social-icons1">
                        <button type="button"><FaFacebookF /></button>
                        <button type="button"><FaGoogle /></button>
                        <button type="button"><FaTwitter /></button>
                    </div>
                </div>
            </form>
        </div>
    );
}
