import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaShoppingBag,
  FaUsers,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "../../styles/Sidebar.css";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

function AdminSidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (onCollapseChange) {
        onCollapseChange(newState);
      }
      return newState;
    });
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setButtonsVisible(true);
  };

  useEffect(() => {
    if (loading) {
      localStorage.removeItem('token');
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

  const Logout = () => {
    localStorage.clear()
    setLoading(true);
    setButtonsVisible(false);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? <FaBars color="#fff" /> : <FaTimes color="#fff" />}
      </button>
      <div className="logo">
        <h2>{isCollapsed ? "" : "Sirenah"}</h2>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/MenuAdmin/Dashboard">
              <FaHome /> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/MenuAdmin/Productos">
              <FaShoppingBag /> <span>Productos</span>
            </a>
          </li>
          <li>
            <a href="/MenuAdmin/Usuarios">
              <FaUsers /> <span>Registros</span>
            </a>
          </li>
          <li>
            <a href="/MenuAdmin/Analiticas">
              <FaChartBar /> <span>Analíticas</span>
            </a>
          </li>
          <li>
            <a href="/MenuAdmin/Configuracion">
              <FaCog /> <span>Configuración</span>
            </a>
          </li>
          <li>
            <a href="/MenuAdmin/Ayuda">
              <FaQuestionCircle /> <span>Ayuda</span>
            </a>
          </li>
          <li className="separator"></li>
          <li>
            <a href="/MenuAdmin/Perfil">
              <FaUser /> <span>Perfil</span>
            </a>
          </li>
          <li>
            <a style={{ cursor: "pointer" }} onClick={openModal}>
              <FaSignOutAlt /> <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        aria-label="Confirmar Cierre de Sesión"
      >
        <h2>Confirmar Cierre de Sesión</h2>
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="modal-actions">
          {buttonsVisible && (
            <>
              <button onClick={closeModal} className="cancel-button">
                Cancelar
              </button>
              <button onClick={Logout} className="confirm-button">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            Cerrando sesión...
          </div>
        )}
      </Modal>
    </div>
  );
}
AdminSidebar.propTypes = {
  onCollapseChange: PropTypes.func.isRequired,
};
export default AdminSidebar;
