import UserSidebar from "../../components/layout/UserSidebar"
import { useEffect, useState } from 'react';
import '../../styles/stylesAdm/APerfil.css';
import { obtenerDatos } from "../../services/perfil";
import { AlertaDeError, AlertaDeExito } from "../../utils/Alertas";
import { TOKEN_API_RECIEC } from '../../constants/tokens';
import { actualizarUsuario } from "../../services/clienteApi";
import {
    validarTelefono,
    validarFechaNacimiento,
} from "../../utils/Validaciones";

function Perfil() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [errores, setErrores] = useState({});
    useEffect(() => {
        fetchUserData();
    }, []);
    const fetchUserData = async () => {
        try {
            const data = await obtenerDatos();
            setUser(data);
        } catch (error) {
            console.error(error);
            AlertaDeError('Error', 'Error al listar usuarios');
        }
    };
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        ourUsers: {
            id: '',
            apellido: '',
            dni: '',
            telefono: '',
            fecha_nacimiento: '',
        }
    });
    const closeModal = () => {
        setModalVisible(false);
    };

    const openEditModal = (userForm) => {
        setUserForm({
            name: user.nombre,
            email: user.email,
            password: user.password,
            role: user.role,
            ourUsers: {
                id: user.id,
                apellido: user.apellido,
                dni: user.dni,
                telefono: user.telefono,
                fecha_nacimiento: user.fecha_nacimiento,
            }
        });
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (Object.values(errores).some(error => error)) return;
        try {
            const response = await fetch('https://apiperu.dev/api/dni', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN_API_RECIEC}`,
                },
                body: JSON.stringify({ dni: userForm.ourUsers.dni }),
            });

            const data = await response.json();

            if (userForm.name.toUpperCase() !== data.data.nombres && userForm.ourUsers.apellido.toUpperCase() !== (data.data.apellido_paterno + " " + data.data.apellido_materno)) {
                setErrores(prev => ({ ...prev, nombre: 'Verificar que el nombre sea correcto.' }));
                setErrores(prev => ({ ...prev, apellido: 'Verificar que el apellido sea correcto.' }));
                return;
            } else if (userForm.name.toUpperCase() !== data.data.nombres) {
                setErrores(prev => ({ ...prev, nombre: 'Verificar que el nombre sea correcto.' }));
                return;
            } else if (userForm.ourUsers.apellido.toUpperCase() !== (data.data.apellido_paterno + " " + data.data.apellido_materno)) {
                setErrores(prev => ({ ...prev, apellido: 'Verificar que el apellido sea correcto.' }));
                return;
            } else if (!data.success) {
                setErrores(prev => ({ ...prev, dni: 'No se encontraron registros.' }));
                return;
            }
            const { id } = userForm.ourUsers;
            if (id) {
                const response = await actualizarUsuario(userForm);

                if (response.statuscode === 408) {
                    AlertaDeError("Error", "Usuario no encontrado");
                } else if (response.statuscode === 409) {
                    AlertaDeError("Error", "El correo electrónico ya está en uso.");
                } else if (response.statuscode === 410) {
                    AlertaDeError(
                        "Error",
                        "Ya hay un usuario con el DNI registrado"
                    );
                } else {
                    AlertaDeExito(
                        "Usuario actualizado",
                        "El usuario fue actualizado exitosamente."
                    );
                    closeModal();
                    fetchUserData();
                }
            } else {
                AlertaDeError("Error", "ID de usuario no encontrado.");
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            AlertaDeError("Error", "Error al actualizar usuario");
        }

    };
    const handleCollapseChange = (collapsed) => {
        setIsCollapsed(collapsed);
    };


    


    return (
        <div className="user-layout">
            <UserSidebar onCollapseChange={handleCollapseChange} />
            <main className={`profile-content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="welcome-section">
                    <h1>Bienvenido de nuevo</h1>
                    <p className="subtitle">Panel de Control Personal</p>
                </div>

                <div className="profile-grid">
                    {user ? (
                        <>
                            <div className="profile-card main-info">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        {user.nombre.charAt(0)}
                                    </div>
                                    <div className="profile-title">
                                        <h2>{user.nombre} {user.apellido}</h2>
                                        <span className="role-badge">{user.role}</span>
                                    </div>
                                </div>
                                <div className="profile-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Miembro desde</span>
                                        <span className="stat-value">{user.fechaUnion || '15 de Enero, 2024'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-card contact-info">
                                <h3>Información de Contacto</h3>
                                <div className="info-item">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Teléfono</span>
                                    <span className="info-value">{user.telefono}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">DNI</span>
                                    <span className="info-value">{user.dni}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Fecha de Nacimiento</span>
                                    <span className="info-value">{user.fecha_nacimiento}</span>
                                </div>
                            </div>

                            <div className="profile-card quick-actions">
                                <h3>Acciones Rápidas</h3>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={openEditModal}>Editar Perfil</button>
                                    <button className="action-btn">Cambiar Contraseña</button>
                                    <button className="action-btn">Configurar Notificaciones</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="loading-message">Cargando datos del usuario...</div>
                    )}
                    {modalVisible && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Mis datos</h2>
                                <form>
                                    <label>Email</label>
                                    <input
                                        readOnly
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, email: e.target.value })
                                        }
                                    />
                                    {errores.email && (
                                        <p className="error-message">{errores.email}</p>
                                    )}
                                    <label>Nombre</label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) =>
                                            setUserForm({ ...userForm, name: e.target.value })
                                        }
                                    />
                                    <label>Apellido</label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={userForm.ourUsers.apellido}
                                        onChange={(e) =>
                                            setUserForm({
                                                ...userForm,
                                                ourUsers: {
                                                    ...userForm.ourUsers,
                                                    apellido: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                    <label>DNI</label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={userForm.ourUsers.dni}
                                        onChange={(e) =>
                                            setUserForm({
                                                ...userForm,
                                                ourUsers: { ...userForm.ourUsers, dni: e.target.value },
                                            })
                                        }
                                    />
                                    <label>Teléfono</label>
                                    <input
                                        type="text"
                                        value={userForm.ourUsers.telefono}
                                        onChange={(e) =>
                                            setUserForm({
                                                ...userForm,
                                                ourUsers: {
                                                    ...userForm.ourUsers,
                                                    telefono: e.target.value,
                                                },
                                            })
                                        }
                                        onBlur={() => validarTelefono(userForm.ourUsers.telefono, setErrores)}
                                    />
                                    {errores.telefono && (
                                        <p className="error-message">{errores.telefono}</p>
                                    )}
                                    <label>Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        value={userForm.ourUsers.fecha_nacimiento}
                                        onChange={(e) =>
                                            setUserForm({
                                                ...userForm,
                                                ourUsers: {
                                                    ...userForm.ourUsers,
                                                    fecha_nacimiento: e.target.value,
                                                },
                                            })
                                        }
                                        onBlur={() => validarFechaNacimiento(userForm.ourUsers.fecha_nacimiento, setErrores)}
                                    />
                                    {errores.fechaNacimiento && (
                                        <p className="error-message">{errores.fechaNacimiento}</p>
                                    )}
                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            onClick={handleSaveEdit}
                                            className="save-btn"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="cancel-btn"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Perfil;
