import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import { useState } from "react";

function Nosotros() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main>

      </main>
      <Footer isDarkMode={isDarkMode} />
    </>
  )
}

export default Nosotros
