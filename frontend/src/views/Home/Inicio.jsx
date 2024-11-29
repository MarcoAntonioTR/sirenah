import { useState } from 'react';
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import "../../styles/Inicio.css";

const Inicio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Array de imágenes para el carrusel
  const images = [
    {
      src: "../../../src/assets/InicioImgs/Frontis1.jpg",
      title: "Tienda de ropa alternativa",
      description: "Prendas en tendencia"
    },
    {
      src: "../../../src/assets/InicioImgs/Frontis2.jpg",
      title: "Título 2",
      description: "Descripción del segundo slide."
    },
    {
      src: "../../../src/assets/InicioImgs/Frontis3.jpg",
      title: "Título 3",
      description: "Descripción del tercer slide."
    }
  ];

  // Funciones para navegar entre imágenes
  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}> {/* Aplica la clase para el dark mode */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main>
        {/* Sección del Carrusel */}
        <section className="carousel">
          <div className="carousel-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === currentSlide ? 'active' : ''}`}>
                <img src={image.src} alt={image.title} />
                <div className="carousel-overlay">
                  <h5>{image.title}</h5>
                  <p>{image.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="prev" onClick={handlePrev}>&#10094;</button>
          <button className="next" onClick={handleNext}>&#10095;</button>
        </section>

        {/* Nuevas Colecciones */}
        <section className="new-collection">
          <h2>Nuevas Colecciones</h2>
          <div className="collection-grid">
            <div className="collection-item">
              <img src="../../../src/assets/InicioImgs/Collection1.jpg" alt="Colección 1" />
              <h3>Colección Otoño</h3>
            </div>
            <div className="collection-item">
              <img src="../../../src/assets/InicioImgs/Collection2.jpg" alt="Colección 2" />
              <h3>Colección Invierno</h3>
            </div>
            <div className="collection-item">
              <img src="../../../src/assets/InicioImgs/Collection3.jpg" alt="Colección 3" />
              <h3>Colección Verano</h3>
            </div>
          </div>
        </section>

        {/* Productos Más Vendidos */}
        <section className="best-sellers">
          <h2>Productos Destacados</h2>
          <div className="products-grid">
            <div className="product-item">
              <img src="../../../src/assets/InicioImgs/Product1.jpg" alt="Producto 1" />
              <h3>Vestido Floral</h3>
              <p>$45.99</p>
            </div>
            <div className="product-item">
              <img src="../../../src/assets/InicioImgs/Product2.jpg" alt="Producto 2" />
              <h3>Chaqueta Denim</h3>
              <p>$65.99</p>
            </div>
            <div className="product-item">
              <img src="../../../src/assets/InicioImgs/Product3.jpg" alt="Producto 3" />
              <h3>Pantalón Culotte</h3>
              <p>$39.99</p>
            </div>
          </div>
        </section>

        {/* Reseñas de Clientes */}
        <section className="customer-reviews">
          <h2>Lo Que Dicen Nuestras Clientas</h2>
          <div className="reviews-grid">
            <div className="review-item">
              <p> Me encantó la calidad de la ropa! Definitivamente volveré a comprar. </p>
              <h4>- María G.</h4>
            </div>
            <div className="review-item">
              <p> Los vestidos son increíbles, tal como se ven en las fotos. </p>
              <h4>- Laura P.</h4>
            </div>
            <div className="review-item">
              <p> Excelente atención al cliente y envío rápido. </p>
              <h4>- Ana T.</h4>
            </div>
          </div>
        </section>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Inicio;
