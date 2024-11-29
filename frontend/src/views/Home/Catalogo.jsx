import ProductList from "../../components/common/ProductList";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import "../../styles/Catalogo.css";
import { useState } from "react";

function Catalogo() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <ProductList />
      <Footer isDarkMode={isDarkMode} />
    </>
  );
}

export default Catalogo;
