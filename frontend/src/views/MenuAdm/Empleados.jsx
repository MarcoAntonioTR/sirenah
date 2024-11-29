import AdminSidebar from "../../components/layout/AdminSidebar.jsx";
import { useState, useEffect } from "react";
import {
  actualizarUsuario,
  eliminarUsuario,
} from "../../services/usuariosApi.js";
import { listarEmpleados } from "../../services/empleadosApi.js"; 
import "../../styles/stylesAdm/ATablas.css";
import {
  AlertaDeEliminacion,
  AlertaDeError,
  AlertaDeExito,
} from "../../utils/Alertas.js";
import { useNavigate } from "react-router-dom";
import { TOKEN_API_RECIEC } from '../../constants/tokens';
import {
  validarNombre,
  validarApellido,
  validarEmail,
  validarDni,
  validarTelefono,
  validarFechaNacimiento,
} from "../../utils/Validaciones";

function Administradores() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchDni, setSearchDni] = useState("");
  const navigate = useNavigate();
  const [errores, setErrores] = useState({});

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLEADO",
    ourUsers: {
      id: "",
      apellido: "",
      dni: "",
      telefono: "",
      fecha_nacimiento: "",
    },
  });

  const resetUserForm = () =>
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "EMPLEADO",
      ourUsers: {
        id: "",
        apellido: "",
        dni: "",
        telefono: "",
        fecha_nacimiento: "",
      },
    });

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const fetchUsuarios = async () => {
    try {
      const data = await listarEmpleados();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      console.error(error);
      AlertaDeError("Error", "Error al listar usuarios");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);


  const handleAddUser = async (e) => {
    e.preventDefault();

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
      }

      const body = {
        name: userForm.name,
        email: userForm.email,
        role: "EMPLEADO",
        password: userForm.name,
        ourUsers: {
          apellido: userForm.ourUsers.apellido,
          dni: userForm.ourUsers.dni,
          telefono: userForm.ourUsers.telefono,
          fecha_nacimiento: userForm.ourUsers.fecha_nacimiento,
        },
      };

      try {
        const signupResponse = await fetch("http://localhost:9090/auth/signup", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const signupData = await signupResponse.json();

        if (signupData.statuscode === 200) {
          AlertaDeExito('Éxito!', 'Empleado añadido Correctamente');
          resetUserForm();
          setErrores({});
        } else if (signupData.statuscode === 409) {
          AlertaDeError(
            "Error",
            "El correo electrónico ya está en uso."
          );
        } else if (data.statuscode === 410) {
          AlertaDeError(
            "Error",
            "Ya hay un usuario con el DNI registrado"
          );
        } else if (data.statuscode === 500) {
          AlertaDeError(
            "Error",
            "Hubo un problema con el servidor. Intenta nuevamente.'"
          );
        }
        setTimeout(() => {
          closeModal();
        }, 2000);
        fetchUsuarios();
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErrores({ global: 'Hubo un error al registrar. Intenta nuevamente.' });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrores(prev => ({ ...prev, dni: 'Error al conectar con la API de RENIEC. Intente nuevamente.' }));
    }
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
      } else if (data.success == false) {
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
          setTimeout(() => {
            closeModal();
          }, 2000);
          fetchUsuarios();
        }
      } else {
        AlertaDeError("Error", "ID de usuario no encontrado.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      AlertaDeError("Error", "Error al actualizar usuario");
    }

  };

  const handleDeleteUser = async () => {
    const result = await AlertaDeEliminacion();
    if (result.isConfirmed) {
      try {
        const response = await eliminarUsuario(userForm);
        if (response.statuscode === 408) {
          AlertaDeError("Error", "Usuario no encontrado");
        } else {
          AlertaDeExito(
            "Usuario eliminado",
            "El usuario fue eliminado exitosamente."
          );
          closeModal();
          fetchUsuarios();
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        AlertaDeError("Error", "Error al eliminar usuario");
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
      password: "",
      role: "ADMIN",
      ourUsers: {
        id: usuario.id,
        apellido: usuario.apellido,
        dni: usuario.dni,
        telefono: usuario.telefono,
        fecha_nacimiento: usuario.fecha_nacimiento,
      },
    });
    setModalVisible(true);
  };

  const handleSearchDni = (e) => {
    let dni = e.target.value;

    dni = dni.replace(/\D/g, "");
    if (dni.length > 8) {
      dni = dni.substring(0, 8);
    }
    setSearchDni(dni);
    const filtered = usuarios.filter((usuario) => usuario.dni.includes(dni));
    setFilteredUsuarios(filtered);
  };

  return (
    <div className="Admin-layout">
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <main className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="header-section">
          <h1>Gestión de Empleados</h1>
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDni}
            onChange={handleSearchDni}
            className="add-btn1"
          />
          <button
            onClick={() => {
              resetUserForm();
              setModalVisible(true);
            }}
            className="add-btn1"
          >
            + Añadir Empleado
          </button>
          <button
            onClick={() => navigate("/MenuAdmin/Usuarios")}
            className="add-btn1"
          >
            Ir a Usuarios
          </button>
          <button
            onClick={() => navigate("/MenuAdmin/Administradores")}
            className="add-btn1"
          >
            Ir a Administradores
          </button>
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
                    <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button
                        onClick={() => openEditModal(usuario)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
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
              <h2>
                {userForm.ourUsers.id ? "Editar Empleado" : "Añadir Empleado"}
              </h2>
              <form>
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  onBlur={() => validarEmail(userForm.email,userForm.ourUsers.id, setErrores)}
                />
                {errores.email && (
                  <p className="error-message">{errores.email}</p>
                )}
                <label>Nombre</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  onBlur={() => validarNombre(userForm.name, setErrores)}
                />
                {errores.nombre && (
                  <p className="error-message">{errores.nombre}</p>
                )}
                <label>Apellido</label>
                <input
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
                  onBlur={() => validarApellido(userForm.ourUsers.apellido, setErrores)}
                />
                {errores.apellido && (
                  <p className="error-message">{errores.apellido}</p>
                )}
                <label>DNI</label>
                <input
                  type="text"
                  value={userForm.ourUsers.dni}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      ourUsers: { ...userForm.ourUsers, dni: e.target.value },
                    })
                  }
                  onBlur={() => validarDni(userForm.ourUsers.dni, userForm.ourUsers.id,  setErrores)}
                />
                {errores.dni && (
                  <p className="error-message">{errores.dni}</p>
                )}
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
                    onClick={
                      userForm.ourUsers.id ? handleSaveEdit : handleAddUser
                    }
                    className="save-btn"
                  >
                    {userForm.ourUsers.id ? "Guardar" : "Añadir"}
                  </button>
                  {userForm.ourUsers.id && (
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  )}
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
      </main>
    </div>
  );
}

export default Administradores;
