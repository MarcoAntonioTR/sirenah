import { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaIdCard, FaPhone, FaFacebookF, FaGoogle, FaTwitter, FaTimes } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../../styles/Registro.css';
import { Link } from 'react-router-dom';
import { validarNombre, validarApellido, validarEmail, validarDni, validarTelefono, validarFechaNacimiento, validarPassword, validarConfirmPassword } from '../../utils/Validaciones';
import { AlertaDeExito, AlertaDeError } from '../../utils/Alertas'
import { useNavigate } from 'react-router-dom';
import { TOKEN_API_RECIEC } from '../../constants/tokens';

function Registro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [errores, setErrores] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const manejarRegistro = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrores(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
            return;
        }

        if (Object.values(errores).some(error => error)) return;


        try {
            const response = await fetch('https://apiperu.dev/api/dni', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN_API_RECIEC}`,
                },
                body: JSON.stringify({ dni })
            });
            
            const data = await response.json();
            if (nombre.toUpperCase() !== data.data.nombres && apellido.toUpperCase() !== (data.data.apellido_paterno + " " + data.data.apellido_materno)) {
                setErrores(prev => ({ ...prev, nombre: 'Verificar que el nombre sea correcto.' }));
                setErrores(prev => ({ ...prev, apellido: 'Verificar que el apellido sea correcto.' }));
                return;
            } else if (nombre.toUpperCase() !== data.data.nombres) {
                setErrores(prev => ({ ...prev, nombre: 'Verificar que el nombre sea correcto.' }));
                return;
            } else if (apellido.toUpperCase() !== (data.data.apellido_paterno + " " + data.data.apellido_materno)) {
                setErrores(prev => ({ ...prev, apellido: 'Verificar que el apellido sea correcto.' }));
                return;
            } else if ("No se encontraron registros" == data.message) {
                setErrores(prev => ({ ...prev, dni: 'No se encontraron registros.' }));
                return;
            }

            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErrores(prev => ({ ...prev, dni: 'No se encontraron registros.' }));
            return;
        }

        const body = {
            name: nombre,
            email: email,
            password: password,
            role: "USER",
            ourUsers: {
                apellido: apellido,
                dni: dni,
                telefono: telefono,
                fecha_nacimiento: fechaNacimiento,
            }
        };

        try {
            const response = await fetch('http://localhost:9090/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (data.statuscode === 200) {
                AlertaDeExito('¡Bienvenido!', 'Te has registrado correctamente.');
                setEmail('');
                setPassword('');
                setNombre('');
                setApellido('');
                setDni('');
                setTelefono('');
                setFechaNacimiento('');
                setConfirmPassword('');
                setErrores({});
            } else if (data.statuscode === 409) {
                AlertaDeError(
                    "Error",
                    "Ya hay un usuario con el email registrado"
                );
                return;
            } else if (data.statuscode === 410) {
                AlertaDeError(
                    "Error",
                    "Ya hay un usuario con el DNI registrado"
                );
                return;
            }
            else if (data.statuscode === 500) {
                AlertaDeError(
                    "Error",
                    "Hubo un problema con el servidor. Intenta nuevamente.'"
                );
                return;
            }
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErrores({ global: 'Hubo un error al registrar. Intenta nuevamente.' });
            setSuccess('');
        }
    };


    const alternarVisibilidadPassword = () => {
        setMostrarPassword(!mostrarPassword);
    };
    return (
        <div className="contenedor-registro">
            <button className="btn-close" onClick={() => window.location.href = '/'}>
                <FaTimes className="icon-close" />
            </button>
            <form onSubmit={manejarRegistro} className="formulario-registro">
                <h2 className="titulo-registro">¡Crea tu cuenta!</h2>
                <div className="grupo-input">
                    <label className="etiqueta">Nombre Completo:</label>
                    <div className="input-con-icono">
                        <FaUser className="icono" />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            className="input-registro"
                            onBlur={() => validarNombre(nombre, setErrores)}
                        />
                    </div>
                    {errores.nombre && <p className="error-message">{errores.nombre}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Apellidos Completos:</label>
                    <div className="input-con-icono">
                        <FaUser className="icono" />
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Ingresa tu apellido"
                            className="input-registro"
                            onBlur={() => validarApellido(apellido, setErrores)}
                        />
                    </div>
                    {errores.apellido && <p className="error-message">{errores.apellido}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Correo Electrónico:</label>
                    <div className="input-con-icono">
                        <FaEnvelope className="icono" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            className="input-registro"
                            onBlur={() => validarEmail(email, setErrores)}
                        />
                    </div>
                    {errores.email && <p className="error-message">{errores.email}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">DNI:</label>
                    <div className="input-con-icono">
                        <FaIdCard className="icono" />
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Ingresa tu DNI"
                            className="input-registro"
                            onBlur={() => validarDni(dni, setErrores)}
                        />
                    </div>
                    {errores.dni && <p className="error-message">{errores.dni}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Teléfono:</label>
                    <div className="input-con-icono">
                        <FaPhone className="icono" />
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ingresa tu teléfono"
                            className="input-registro"
                            onBlur={() => validarTelefono(telefono, setErrores)}
                        />
                    </div>
                    {errores.telefono && <p className="error-message">{errores.telefono}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="input-registro"
                        onBlur={() => validarFechaNacimiento(fechaNacimiento, setErrores)}
                    />
                    {errores.fechaNacimiento && <p className="error-message">{errores.fechaNacimiento}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Contraseña:</label>
                    <div className="input-con-icono">
                        <FaLock className="icono" />
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            className="input-registro"
                            onBlur={() => validarPassword(password, setErrores)}
                        />
                    </div>
                    {errores.password && <p className="error-message">{errores.password}</p>}
                </div>
                <div className="grupo-input">
                    <label className="etiqueta">Confirmar Contraseña:</label>
                    <div className="input-con-icono">
                        <FaLock className="icono" />
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu contraseña"
                            className="input-registro"
                            onBlur={() => validarConfirmPassword(password, confirmPassword, setErrores)}
                        />
                    </div>
                    {errores.confirmPassword && <p className="error-message">{errores.confirmPassword}</p>}
                </div>
                <button type="button" onClick={alternarVisibilidadPassword} className="btn-mostrar-password">
                    {mostrarPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    {mostrarPassword ? ' Ocultar contraseña' : ' Mostrar contraseña'}
                </button>
                {success && <p className="success-message">{success}</p>}
                {errores.global && <p className="error-message">{errores.global}</p>}

                <button type="submit" className="boton-registro">Registrarse</button>
                <p className="parrafo-login">
                    ¿Ya tienes una cuenta? <Link to="/Login">Inicia sesión aquí</Link>
                </p>
                <div className="social-login">
                    <p>O regístrate con:</p>
                    <div className="social-icons">
                        <button type="button"><FaFacebookF /></button>
                        <button type="button"><FaGoogle /></button>
                        <button type="button"><FaTwitter /></button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default Registro;
