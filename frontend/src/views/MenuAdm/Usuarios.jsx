import AdminSidebar from "../../components/layout/AdminSidebar.jsx";
import { useState, useEffect } from 'react';
import { listarUsuarios, eliminarUsuario } from '../../services/usuariosApi.js';
import '../../styles/stylesAdm/ATablas.css';
import { AlertaDeEliminacion, AlertaDeError, AlertaDeExito } from '../../utils/Alertas.js';
import { useNavigate } from "react-router-dom";

function Usuarios() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchDni, setSearchDni] = useState('');
    const navigate = useNavigate();

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

    const resetUserForm = () => setUserForm({
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

    const handleCollapseChange = (collapsed) => {
        setIsCollapsed(collapsed);
    };

    const fetchUsuarios = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
            setFilteredUsuarios(data);
        } catch (error) {
            console.error(error);
            AlertaDeError('Error', 'Error al listar usuarios');
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleDeleteUser = async () => {
        const result = await AlertaDeEliminacion();
        if (result.isConfirmed) {
            try {
                const response = await eliminarUsuario(userForm);
                if (response.statuscode === 408) {
                    AlertaDeError('Error', 'Usuario no encontrado');
                } else {
                    AlertaDeExito('Usuario eliminado', 'El usuario fue eliminado exitosamente.');
                    closeModal();
                    fetchUsuarios();
                }
            } catch (error) {
                console.error(error);
                AlertaDeError('Error', 'Error al eliminar usuario');
            }
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        resetUserForm();
    };

    const openEditModal = (usuario) => {
        setUserForm({
            name: usuario.nombre,
            email: usuario.email,
            password: '',
            role: 'USER',
            ourUsers: {
                id: usuario.id,
                apellido: usuario.apellido,
                dni: usuario.dni,
                telefono: usuario.telefono,
                fecha_nacimiento: usuario.fecha_nacimiento,
            }
        });
        setModalVisible(true);
    };

    const handleSearchDni = (e) => {
        let dni = e.target.value;

        dni = dni.replace(/\D/g, '');
        if (dni.length > 8) {
            dni = dni.substring(0, 8);
        }
        setSearchDni(dni);
        const filtered = usuarios.filter(usuario => usuario.dni.includes(dni));
        setFilteredUsuarios(filtered);
    };

    return (
        <div className="Admin-layout">
            <AdminSidebar onCollapseChange={handleCollapseChange} />
            <main className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="header-section">
                    <h1>Gestión de Clientes</h1>
                    <input
                        type="text"
                        placeholder="Buscar por DNI"
                        value={searchDni}
                        onChange={handleSearchDni}
                        className="add-btn1"
                    />
                    <button onClick={() => navigate('/MenuAdmin/Administradores')} className="add-btn1">Ir a Administradores</button>
                    <button onClick={() => navigate('/MenuAdmin/Empleados')} className="add-btn1">Ir a Empleados</button>
                </div>
                <div className="div-table">
                    {filteredUsuarios.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>DNI</th>
                                    <th>Teléfono</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.dni}</td>
                                        <td>{usuario.telefono}</td>
                                        <td>{usuario.fecha_nacimiento}</td>
                                        <td>{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                                        <td>
                                            <button onClick={() => openEditModal(usuario)} className="delete-btn">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay usuarios disponibles</p>
                    )}
                </div>

                {modalVisible && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Datos del Usuario</h2>
                            <form>
                                <label>Email</label>
                                <input readOnly type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />

                                <label>Nombre</label>
                                <input readOnly type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />

                                <label>Apellido</label>
                                <input readOnly type="text" value={userForm.ourUsers.apellido} onChange={(e) => setUserForm({ ...userForm, ourUsers: { ...userForm.ourUsers, apellido: e.target.value } })} />

                                <label>DNI</label>
                                <input readOnly type="text" value={userForm.ourUsers.dni} onChange={(e) => setUserForm({ ...userForm, ourUsers: { ...userForm.ourUsers, dni: e.target.value } })} />

                                <label>Teléfono</label>
                                <input readOnly type="text" value={userForm.ourUsers.telefono} onChange={(e) => setUserForm({ ...userForm, ourUsers: { ...userForm.ourUsers, telefono: e.target.value } })} />

                                <label>Fecha de Nacimiento</label>
                                <input  type="date" value={userForm.ourUsers.fecha_nacimiento} onChange={(e) => setUserForm({ ...userForm, ourUsers: { ...userForm.ourUsers, fecha_nacimiento: e.target.value } })} />

                                <div className="modal-actions">
                                    {userForm.ourUsers.id && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteUser}
                                            className="delete-btn"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                    <button type="button" onClick={closeModal} className="cancel-btn">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Usuarios;
